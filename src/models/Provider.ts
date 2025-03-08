import { closest, distance } from "fastest-levenshtein";
import { ErrorCodes, KomikkuError, type Result } from "../types/Exceptions.ts";
import type { Manga } from "../types/interface.ts";
import type { Chapter } from "../types/types.ts";
import * as deno_dom from "@b-fuze/deno-dom";
const { DOMParser } = deno_dom

export abstract class Provider {
    protected name: string;
    protected baseURL: string;
    protected manga_list: Manga[] = [];
    constructor(name: string, baseURL: string) {
        this.name = name;
        this.baseURL = baseURL;
    }
    getMangaList(): Manga[] {
        return this.manga_list;
    }
    abstract fetchMangaList(): Promise<Manga[]>;
    abstract getChapters(manga: Manga): Promise<Chapter[]>;
    abstract getPages(chapter: Chapter): Promise<Result<string[]>>;
    abstract search(title: string, limitManga?: number): Promise<Result<Manga[]>>;
    abstract grabManga(url: string): Promise<Result<Manga>>;
    abstract getTrending(): Promise<Manga[]>
    /**
     *  
     * @param title the title comparing to the manga object
     * @param manga Manga object containing synonyms and title
     * @returns 0 - 1 value representing the similarity between the two strings
     */
    protected isTheRightManga(title: string, manga: Manga): number {
        const names: string[] = [manga.title?.toLocaleLowerCase(), ...(manga.synonyms?.map(e => e?.toLowerCase()) ?? [])].filter(e => e != undefined)
        if (!names) return 0;
        const closestName = closest(title, names)
        const longestName = [closestName, title].reduce((a, b) => a.length > b.length ? a : b)
        const distanceBetween = distance(title, closestName)
        console.log(`Title: ${title} | Closest: ${closestName} | Distance: ${distanceBetween} | Longest: ${longestName}`)
        //return 0 - 1 value representing the similarity between the two strings
        return (longestName.length - distanceBetween) / longestName.length
        
    }
    /**
 * Parses HTML string into a Document
 * @param html - HTML content as string
 * @returns Parsed Document object
 */
    protected parseHtml(html: string): deno_dom.HTMLDocument {
        return new DOMParser().parseFromString(html, "text/html");
    }
    /**
 * Creates a standardized error result
 * @param message - Error message
 * @returns Result object with error
 */
    protected createErrorResult(message: string, e? : Error): Result<any> {
        return {
            error: new KomikkuError(
                message,
                ErrorCodes.API,
                'PROVIDER',
                this.name,
                false, e
            )
        };
    }
}