import type { Manga } from "../types/interface.ts";

// Define the types for clarity
export class Chapter {
    manga: Manga
    title: string;
    url: string;
    date: Date;
    pages: string[] = [];
    constructor(
        manga: Manga,
        title: string,
        url: string,
        date: Date,
    ) {
        this.manga = manga;
        this.title = title;
        this.url = url;
        this.date = date;
    }
    setPages(pages: string[]) : this {
        this.pages = pages;
        return this;
    }
    async getPages() : Promise<string[]> {
        const Pages =  await this.manga.provider?.getPages(this);
        if (!Pages) return this.pages
        this.setPages(Pages)
        return this.pages
  }
}

