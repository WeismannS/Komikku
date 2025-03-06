import { closest, distance } from "fastest-levenshtein";
import type { Result } from "../types/Exceptions.ts";
import type { Manga } from "../types/interface.ts";
import type { Chapter } from "../types/types.ts";


export abstract class Provider {
    protected name: string;
    protected baseURL: string;
    protected manga_list: Manga[] = [] ;
    constructor(name: string, baseURL: string) {
        this.name = name;
        this.baseURL = baseURL;
    }
     getMangaList(): Manga[] 
     {
            return this.manga_list;
     }
    abstract fetchMangaList(): Promise<Manga[]>;
    abstract getChapters(manga : Manga): Promise<Chapter[]>;
    abstract getPages(chapter : Chapter): Promise<Result<string[]>>;
    abstract search(title : string, limitManga? : number): Promise<Result<Manga[]>>;
    abstract grabManga(url : string): Promise<Result<Manga>>;
    abstract getTrending(): Promise<Manga[]>
    protected isTheRightManga(title : string, manga : Manga): number {
        const names : string[] = [manga.title, ...(manga.synonyms?.map(e=> e?.toLowerCase()) ?? [])].filter(e => e != undefined)
        if (!names) return 0;
        const closestName = closest(title, names)
        const longestName = [closestName, title].reduce((a, b) => a.length > b.length ? a : b)
        const distanceBetween =  distance(title, closestName)
        //return 0 - 1 value representing the similarity between the two strings
        return (longestName.length - distanceBetween) / longestName.length
    }
}