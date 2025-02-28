import { Chapter } from "../utils/types.ts";
import { Provider } from "./Provider.ts";
import { Manga } from "../utils/interface.ts";
import * as deno_dom from "@b-fuze/deno-dom";
import { fetchAnilistDetails, tryFetch } from "../utils/anilist.ts";

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
        const chapterDiv = page.querySelectorAll("#chapters-list > li");
        const updatedAt = page.querySelector("div.flex-row:nth-child(4) > li:nth-child(2)")?.textContent;
        const title = page.querySelector("html body div#manga-info-container.main-width.center-m div#manga-info-rightColumn.inline-block.left-float div.light-bg.padd-1.border-radius-1 h1.border-box.big-fat-titles")?.textContent
        if (!updatedAt || !title) return;
        const chapters: Chapter[] = [];
        const anilist_data = await fetchAnilistDetails(title);
        if (!anilist_data) return;
        manga.setAuthors(anilist_data.authors)
            .setDescription(anilist_data.description)
            .setGenres(anilist_data.genres)
            .setRating(anilist_data.averageScore)
            .setSource(anilist_data.source)
            .setStatus(anilist_data.status)
            .setSynonyms(anilist_data.synonyms)
            .setTitle(anilist_data.title.english || anilist_data.title.romaji || anilist_data.title.native)
            .setTags(anilist_data.tags.map((tag: { name: string; }) => tag.name))
            .setUrl(url)
            .setCover(anilist_data.coverImage.large)
            .setUpdatedAt(new Date(updatedAt))
            .setCreatedAt(new Date(anilist_data.startDate.year, anilist_data.startDate.month, anilist_data.startDate.day))
            .setCharacters(anilist_data.characters.nodes.map((character: { name: { full: string; first: string, last: string }, gender: string, image: string }) =>
                ({ ...character.name, gender: character.gender, image: character.image })))
            return manga;
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
}