import { error } from "node:console";
import type { Manga } from "../types/interface.ts";
import { ErrorCodes, KomikkuError, type Result } from "./Exceptions.ts";

// Define the types for clarity
export class Chapter {
    manga: Manga
    title: string;
    url: string;
    date: Date;
    pages?: string[] = [];
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
    setPages(pages?: string[]) : this {
        this.pages = pages;
        return this;
    }
    async getPages() : Promise<Result<string[]>> {
        if (!this.manga.provider) return { error : new KomikkuError("Provider not set", ErrorCodes.CHAPTER_FETCH_ERROR, "PROVIDER", this.title, false) }
        const { data : Pages, error } = await this.manga.provider.getPages(this);
        if (error) return { error }
        this.setPages(Pages)
        return {data : Pages, error}
  }
}

