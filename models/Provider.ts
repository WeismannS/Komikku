import type { Manga } from "../utils/interface";
import type { Chapter } from "../utils/types";


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
    abstract getPages(chapter : Chapter): Promise<string[]>;
    abstract search(title : string, limitManga? : number): Promise<Manga[] | undefined>;
    abstract grabManga(url : string): Promise<Manga | undefined>;
    abstract getTrending(): Promise<Manga[]>
}