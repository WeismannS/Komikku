import type { comment, Manga } from "./interface";

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
        const Pages =  this.manga.provider.getPages(this);
        this.setPages(await Pages)
        return this.pages
  }
}

