import { Chapter } from "../types/types.ts";
import { Provider } from "./Provider.ts";
import { Manga } from "../types/interface.ts";
import * as deno_dom from "@b-fuze/deno-dom";
import { Anilist } from "../utils/anilist.ts";
import { sleep ,tryFetch } from "../utils/helper.ts";
import { ErrorCodes, KomikkuError, type Result } from "../types/Exceptions.ts";
import { closest } from "fastest-levenshtein";

const { DOMParser } = deno_dom

export class DemonicProvider extends Provider {

    constructor() {
        super("Demonicscans", "https://demonicscans.org/");
    }

    async getPages(chapter: Chapter): Promise<Result<string[]>> {
        const { data: pageText, error } = await tryFetch(this.baseURL + chapter.url, {}, "text");
    if (error || !pageText) {
        return {
            error: new KomikkuError(
                "Could not fetch chapter pages",
                ErrorCodes.CHAPTER_FETCH_ERROR,
                'PROVIDER',
                this.name,
                false,
                error ?? undefined
            )
        };
    }
        const page = new DOMParser().parseFromString(pageText, "text/html");
        const pages = page.querySelectorAll("img.imgholder");
        const images: string[] = [];
        for (let image of pages)
            images.push(image.getAttribute("src") || "")
        return {data : images};
    }

    async getChapters(manga: Manga): Promise<Chapter[]> {
        const { data: pageText, error } = await tryFetch(this.baseURL + manga.url, {}, "text");
        if (error || !pageText) return [];
        const page = new DOMParser().parseFromString(pageText, "text/html");
        const chapterDiv = page.querySelectorAll("#chapters-list > li");

        const chapters: Chapter[] = [];
        for (let chapter_element of chapterDiv) {
            const title = chapter_element.querySelector("a")?.getAttribute("title");
            const url = chapter_element.querySelector("a")?.getAttribute("href");
            const date = chapter_element.querySelector("span")?.textContent;
            if (!title || !url || !date) continue;
            const chapter = new Chapter(manga, title, url, new Date(date));
            chapters.unshift(chapter);
        }
        manga.set({ chapters, chaptersAvailable : chapters.length});
        return chapters;
    }

    async fetchMangaList(): Promise<Manga[]> {
        for (let i = 1; i < 2; i++) {
            const page_url = this.baseURL + "advanced.php?list=" + i;
            const { data: pageText, error } = await tryFetch(page_url, {}, "text");
            if (error || !pageText) continue;
            const page = new DOMParser().parseFromString(pageText, "text/html");
            const mangaDiv = page.querySelectorAll("div.advanced-element");
            const mangaHref = Array.from(mangaDiv, (e) => e.querySelector("a")?.getAttribute("href")).filter(e => e != undefined);
            const mangaList = await Promise.allSettled(mangaHref.map((url) => this.grabManga(url)));
            for (const manga of mangaList) {
                if (manga.status === "fulfilled") {
                    if (manga.value.data)
                        this.manga_list.push(manga.value.data);
                }
            }
        }
        return this.manga_list;
    }

    async grabManga(url: string): Promise<Result<Manga>> {
        const { data: pageText, error } = await tryFetch(this.baseURL + url, {}, "text");
        if (error && !pageText) {
            return {
                error: new KomikkuError(
                    `Failed to fetch manga page: ${url}`,
                    ErrorCodes.API,
                    'PROVIDER',
                    this.name,
                    false,
                    error
                )
            };
        }
        
        const page = new DOMParser().parseFromString(pageText, "text/html");
        const manga = new Manga(this);
        
        // Extract basic metadata from page
        const updatedAt = page.querySelector("div.flex-row:nth-child(4) > li:nth-child(2)")?.textContent;
        const title = page.querySelector("#manga-info-rightColumn h1.big-fat-titles")?.textContent;
        const description = page.querySelector(".white-font")?.textContent;
        const authors = page.querySelector("#manga-info-stats > div:nth-child(1) > li:nth-child(2)")?.textContent?.split(";");
        const status = page.querySelector("div.flex-row:nth-child(3) > li:nth-child(2)")?.textContent;
        
        if (!title)
            return (
        {
            error : new KomikkuError(
                `Failed to fetch manga title: ${url}`,
                ErrorCodes.API,
                'PROVIDER',
                this.name,
                false)})
        
        try {
            // Make a single AniList API call
            let { data: result, error: anilistError } = await new Anilist().search({
                search: title, 
                type: "MANGA", 
                perPage: 1
            });
            const firstManga = result?.[0];
            if (anilistError) {
                console.error(`AniList error for ${title}: ${anilistError.message}`);
                // Continue with basic manga data
            }
            
            if (firstManga) {
                console.info("Proba : " + this.isTheRightManga(title, firstManga));
            }
            // Use result from AniList if available, otherwise use basic manga
            const mangaData = firstManga || manga;
            
            // Set provider-specific data
            mangaData
                .set({
                    authors,
                    description,
                    url,
                    provider : this,
                    status : status?.toLowerCase() === "completed" ? "FINISHED" : "RELEASING"
                })
            
            // Now fetch chapters
            const chapters = await this.getChapters(mangaData);
            mangaData.set({
                chapters : chapters
            })
            
            return {data : mangaData};
        } catch (e) {
            console.error(`Error processing manga ${title}:`, e);
            return {
                error: new KomikkuError(
                    `Failed to process manga: ${title}`,
                    ErrorCodes.API,
                    'PROVIDER',
                    this.name,
                    false,
                    e as Error
                )
            };
        }
    }

    async search(title: string, limitManga? : number): Promise<Result<Manga[]>> {
        let i = 0;
        const results: Manga[] = [];
        const { data: searchPageText, error: searchError } = await tryFetch(this.baseURL + "search.php?manga=" + encodeURIComponent(title), {}, "text");
        if (searchError || !searchPageText) return {
            error : new KomikkuError(
                `Failed to send request to the search page: ${this.baseURL}search.php?manga=${encodeURIComponent(title)}`,
                ErrorCodes.API,
                'PROVIDER',
                this.name,
                false
            )
        };   
        const searchPage = new DOMParser().parseFromString(searchPageText, "text/html");
        const manga_elements = searchPage.querySelectorAll("a");
        for (const manga_element of manga_elements) {
            if (limitManga != undefined && i >= limitManga) break;
            const url = manga_element.getAttribute("href");
            if (!url) continue;
            const {data : manga, error} = await this.grabManga(url);
            if (manga) results.push(manga), i++;
        }
        
        return {data : results};
    }
    async getTrending(): Promise<Manga[]> {
        const { data: pageText, error } = await tryFetch(this.baseURL, {}, "text");
        
        if (error || !pageText) {
            return [];
        }
        
        try {
            const page = new DOMParser().parseFromString(pageText, "text/html");
            const elements = Array.from(
                page.querySelectorAll("#carousel > div > a"), 
                (e) => e.getAttribute("href")
            ).filter(Boolean);
            
            // Process URLs in batches to avoid overloading the server
            const mangaList = [];
            for (const url of elements) {
                try {
                    const {data : manga, error} = await this.grabManga(url || "");
                    if (manga) mangaList.push(manga);
                    await sleep(100);
                } catch (e) {
                    console.error(`Error fetching trending manga ${url}:`, e);
                }
            }
            
            return mangaList;
        } catch (e) {
            console.error("Error fetching trending manga:", e);
            return [];
        }
    }
}