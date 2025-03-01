import type { comment, Manga } from "../types/interface";

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
    setPages(pages: string[]) {
        this.pages = pages;
        return this;
    }
    async getPages() {
        const Pages =  await this.manga.provider?.getPages(this);
        if (!Pages) return this.pages
        this.setPages(Pages)
        return this.pages
  }
}

