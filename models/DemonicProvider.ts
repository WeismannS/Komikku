import { Chapter } from "../types/types.ts";
import { Provider } from "./Provider.ts";
import { Manga } from "../types/interface.ts";
import * as deno_dom from "@b-fuze/deno-dom";
import { Anilist } from "../utils/anilist.ts";
import { sleep ,tryFetch } from "../utils/helper.ts";
import { MediaStatus, MediaType } from "../types/MediaSchema.ts";

const { DOMParser } = deno_dom

export class DemonicProvider extends Provider {

    constructor() {
        super("Demonicscans", "https://demonicscans.org/");
    }

    async getPages(chapter: Chapter): Promise<string[]> {
        const { data: pageText, error } = await tryFetch(this.baseURL + chapter.url, {}, "text");
        if (error || !pageText) return [];
        const page = new DOMParser().parseFromString(pageText, "text/html");
        const pages = page.querySelectorAll("img.imgholder");
        const images: string[] = [];
        for (let image of pages)
            images.push(image.getAttribute("src") || "")
        return images;
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
        manga.setChapters(chapters);
        manga.chaptersAvailable = chapters.length;
        return chapters;
    }

    async fetchMangaList(): Promise<Manga[]> {
        for (let i = 1; i < 2; i++) {
            const page_url = this.baseURL + "advanced.php?list=" + i;
            const { data: pageText, error } = await tryFetch(page_url, {}, "text");
            if (error || !pageText) continue;
            const page = new DOMParser().parseFromString(pageText, "text/html");
            const mangaDiv = page.querySelectorAll("div.advanced-element");
            for (let manga_element of mangaDiv) {
                const title = manga_element.querySelector("a")?.getAttribute("title");
                const url = manga_element.querySelector("a")?.getAttribute("href");
                if (!title || !url) continue;
                const manga = await this.grabManga(url);
                if (!manga) continue;
                this.manga_list.push(manga);
            }
        }
        return this.manga_list;
    }

    async grabManga(url: string): Promise<Manga | undefined> {
        const { data: pageText, error } = await tryFetch(this.baseURL + url, {}, "text");
        if (error || !pageText) return;
        const page = new DOMParser().parseFromString(pageText, "text/html");
        const manga = new Manga(this);
        const updatedAt = page.querySelector("div.flex-row:nth-child(4) > li:nth-child(2)")?.textContent;
        const title = page.querySelector("html body div#manga-info-container.main-width.center-m div#manga-info-rightColumn.inline-block.left-float div.light-bg.padd-1.border-radius-1 h1.border-box.big-fat-titles")?.textContent
        const rating = page.querySelector("html body div#manga-info-container.main-width.center-m div#manga-page.inline-block.border-box.left-float div#R-V-B.border-box.center-align li.RVB.light-bg")
        const description = page.querySelector(".white-font")?.textContent;
        const cover = page.querySelector("html body div#manga-info-container.main-width.center-m div#manga-page.inline-block.border-box.left-float div.center-align.full-width img.border-box")
        const authors = page.querySelector("#manga-info-stats > div:nth-child(1) > li:nth-child(2)")?.textContent?.split(";");
        const genres = Array.from(page.querySelectorAll(".genres-list > li"), (genre) => genre.textContent?.trim());
        
        const status = page.querySelector("div.flex-row:nth-child(3) > li:nth-child(2)")?.textContent;
        if (!updatedAt || !title) return;
        let anilist_data;
        if (url.split("/")[1] == "manga")
             anilist_data = (await new Anilist().search({search:title, type:MediaType.Manga, perPage:1}))
        anilist_data = anilist_data?.[0];
        if (rating) manga.setRating(parseInt(rating.textContent));
        status?.toLowerCase() == "completed" ? MediaStatus.Finished : MediaStatus.Releasing;
        let result = (await new Anilist().search({search:title, type:MediaType.Manga, perPage:1}))?.[0];
        if (!result) return;
            result.setChapters(await this.getChapters(manga));
            return result.setProvider(this).setUrl(url).setAuthors(authors);
    }


            
    async search(title: string, limitManga? : number): Promise<Manga[]> {
        let i = 0;
        const results: Manga[] = [];
        const { data: searchPageText, error: searchError } = await tryFetch(this.baseURL + "search.php?manga=" + encodeURIComponent(title), {}, "text");
        if (searchError || !searchPageText) return results;   
        const searchPage = new DOMParser().parseFromString(searchPageText, "text/html");
        const manga_elements = searchPage.querySelectorAll("a");
        for (const manga_element of manga_elements) {
            if (limitManga != undefined && i >= limitManga) break;
            const url = manga_element.getAttribute("href");
            if (!url) continue;
            const manga = await this.grabManga(url);
            if (manga) results.push(manga), i++;
        }
        
        return results;
    }
    async getTrending(): Promise<Manga[]> {
        const { data: searchPageText, error: searchError } = await tryFetch(this.baseURL,{}, "text");
        if (searchError || !searchPageText) return [];
        const searchPage = new DOMParser().parseFromString(searchPageText, "text/html");
        const elements = Array.from(searchPage.querySelectorAll("#carousel > div > a"), ((e)=>e.getAttribute("href"))) 
        const mangaList = (await Promise.all(elements.map(async (url) => await this.grabManga(url || ""), await sleep(100)))).filter((manga) => manga != undefined);
        return mangaList;
    }
}