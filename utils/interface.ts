import type { Provider } from "../models/Provider"
import type { Chapter } from "./types"

export interface comment {
    username: string
    comment: string
    date: Date
    likes: number
    dislikes: number
}


export interface Character {
    first : string
    last : string
    full : string
    gender : "Male" | "Female" | "Unknown"
    image : string
}

type  status = "FINISHED" | "RELEASING" | "CANCELLED" | "NOT_YET_RELEASED" | "HIATUS" | "UNKNOWN" ;
type source = "ORIGINAL" | "MANGA" | "LIGHT_NOVEL" | "VISUAL_NOVEL" | "VIDEO_GAME" | "OTHER" | "NOVEL" | "DOUJINSHI" | "ANIME" | "WEB_NOVEL" | "LIVE_ACTION" | "GAME" | "COMIC" | "MULTIMEDIA_PROJECT" | "PICTURE_BOOK" | "UNKNOWN";
export class Manga {
    title: string;
    Synonyms: string[];
    authors: string | string[];
    genres: string[];
    status: status;
    description: string;
    Chapters: Chapter[] | [];
    chaptersAvailable: number;
    created_at: Date;
    updated_at: Date;
    cover: string;
    url: string;
    rating: number;
    source: source;
    Tags: string[];
    characters: Character[];
    provider: Provider;

    constructor(provider: Provider
    ) {
        this.title = "";
        this.Synonyms = [];
        this.authors = "";
        this.genres = [];
        this.status = "UNKNOWN";
        this.description = "";
        this.Chapters = [];
        this.chaptersAvailable = 0;
        this.created_at = new Date();
        this.updated_at = new Date();
        this.cover = "";
        this.url = "";
        this.rating = 0;
        this.source = "UNKNOWN";
        this.Tags = [];
        this.characters = [];
        this.provider = provider;
    }
    setTitle(title: string) {
        this.title = title;
        return this;
    }

    getChapters() {
        return this.provider.getChapters(this);
    }

    setSynonyms(Synonyms: string[]) {
        this.Synonyms = Synonyms;
        return this;
    }

    setAuthors(authors: string | string[]) {
        this.authors = authors;
        return this;
    }

    setGenres(genres: string[]) {
        this.genres = genres;
        return this;
    }

    setStatus(status: status) {
        this.status = status;
        return this;
    }

    setDescription(description: string) {
        this.description = description;
        return this;
    }

    setChapters(Chapters: Chapter[] | []) {
        this.Chapters = Chapters;
        return this;
    }

    setChaptersCount(chaptersAvailable: number) {
        this.chaptersAvailable = chaptersAvailable;
        return this;
    }

    setCreatedAt(created_at: Date) {
        this.created_at = created_at;
        return this;
    }

    setUpdatedAt(updated_at: Date) {
        this.updated_at = updated_at;
        return this;
    }

    setCover(cover: string) {
        this.cover = cover;
        return this;
    }

    setUrl(url: string) {
        this.url = url;
        return this;
    }



    setRating(rating: number) {
        this.rating = rating;
        return this;
    }

    setSource(source: source) {
        this.source = source;
        return this;
    }

    setTags(Tags: string[]) {
        this.Tags = Tags;
        return this;
    }

    setCharacters(character: Character[]) {
        this.characters = character;
        return this;
    }
}
