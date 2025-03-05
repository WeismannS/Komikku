import type { Provider } from "../models/Provider.ts"
import type { Chapter } from "../types/types.ts"
import { type MediaStatus, type Maybe, type Media, type MediaTag, type FuzzyDate, type MediaSeason } from "./MediaSchema.ts"

export interface Character {
    first? :  Maybe<string> 
    last? : Maybe<string> 
    full? : Maybe<string> 
    gender? :  Maybe<string> 
    image? :  Maybe<string> 
}

type  status = "FINISHED" | "RELEASING" | "CANCELLED" | "NOT_YET_RELEASED" | "HIATUS" | "UNKNOWN" ;
type source = "ORIGINAL" | "MANGA" | "LIGHT_NOVEL" | "VISUAL_NOVEL" | "VIDEO_GAME" | "OTHER" | "NOVEL" | "DOUJINSHI" | "ANIME" | "WEB_NOVEL" | "LIVE_ACTION" | "GAME" | "COMIC" | "MULTIMEDIA_PROJECT" | "PICTURE_BOOK" | "UNKNOWN";
type Nullable<T> = T | null | undefined;
class BaseMedia {
    idMAL?:Maybe<number>;
    title?:Maybe<string>;
    popularity?: Maybe<number>;
    favorites?: Maybe<number>;
    description?: Media["description"];
    synonyms?:Media["synonyms"];
    authors?:Maybe<string[]>;
    genres?:Maybe<Media["genres"]>;
    status?: Maybe<Media["status"]>;
    isAdult?:Maybe<boolean>;
    started_at?:Maybe<Date>;
    ended_at?:Maybe<Date>;
    updated_at?:Maybe<Date>;
    cover?:Maybe<string>;
    url?:Maybe<string>;
    rating?:Maybe<number>;
    source?: Maybe<Media["source"]>;
    tags?:Maybe<string[]>;
    characters?:Maybe<Character[]>;
    provider?:Maybe<Provider>;
    aniURL?:Maybe<string>;
    countryOfOrigin?:Maybe<string>;
    season?: Maybe<MediaSeason>;
    seasonYear?: Maybe<number>;
    constructor(provider?:Provider) {
        this.synonyms = [];
        this.authors = [];
        this.genres = [];
        this.status = undefined;
        this.started_at = new Date();
        this.ended_at = new Date();
        this.updated_at = new Date();
        this.rating = 0;
        this.source = undefined;
        this.tags = [];
        this.characters = [];
        this.provider = provider;
    }
    set<K extends keyof this>(key: {
        [key in K] : typeof this[key]
    }): this {
        Object.assign(this, key);
        return this;
    }
    
    protected pullBaseData(data: Media | undefined): this {
        if (!data) return this;
        let tags : string[] = data.tags?.map((tag: Maybe<MediaTag>) => tag?.name).filter((tag) => tag != undefined) ?? [];
        let characters_filtered = data.characters?.nodes?.filter((character) => character != undefined);
        let characters  = characters_filtered?.map((character) =>  ({
            first: character?.name?.first ?? null,
            last: character?.name?.last ?? null,
            full: character?.name?.full ?? null,
            gender: character?.gender ?? null,
            image: character?.image?.medium ?? null

        })) ?? [];
        const started_at = this.createSafeDate(data.startDate);
        const ended_at = this.createSafeDate(data.endDate);
        this.set({
        "tags" : tags,
        "characters" : characters,
        "title" : data.title?.userPreferred,
        "popularity" : data.popularity,
        "favorites" : data.favourites,
        "description" : data.description,
        "synonyms" : data.synonyms,
        "status" : data.status,
        "isAdult" : data.isAdult,
        "started_at" : started_at,
        "ended_at" : ended_at,
        "cover" : data.coverImage?.extraLarge,
        "aniURL" : data.siteUrl,
        "countryOfOrigin" : data.countryOfOrigin,
        "season" : data.season,
        "seasonYear" : data.seasonYear,
        "rating" : data.averageScore,
        "source" : data.source,
        "genres" : data.genres
    });
        return this;
    }

    private createSafeDate(dateObj?: Nullable<FuzzyDate>): Date {
        if (!dateObj?.year) return new Date();
        
        try {
            return new Date(
            dateObj.year, 
            (dateObj.month || 1) - 1,
            dateObj.day || 1
            );
        } catch {
            return new Date();
        }
    }
}


export class Manga extends BaseMedia {
    chapters: Chapter[];
    chaptersAvailable: number;
    volumes: Nullable<number>;
    constructor(provider?: Provider) {
        super(provider);
        this.chapters = [];
        this.chaptersAvailable = 0;
    }
    getChapters():Promise<Chapter[] | undefined> | undefined {
        return this.provider?.getChapters(this);
    }
    setAuthors(authors: string[] | undefined
    ): this {
        this.authors = authors;
        return this;
    }
    setChapters(Chapters: Chapter[] | []): this {
        this.chapters = Chapters;
        return this;
    }
    setVolumes(volumes: Nullable<number>): this {
        this.volumes = volumes;
        return this;
    }
    setChaptersCount(chaptersAvailable: number): this {
        this.chaptersAvailable = chaptersAvailable;
        return this;
    }
    
    pullData(data: Media | undefined): this {
        this.pullBaseData(data)
        .set({
            "volumes" : data?.volumes,
        })  
        return this;
    }
}

export class Anime extends BaseMedia {
    episodes: Nullable<number>;
    constructor(provider?: Provider) {
        super(provider);
        this.episodes = 0;
    }
    setEpisodes(episodes: Nullable<number>) : this {
        this.episodes = episodes;
        return this;
    }
    pullData(data: Media | undefined): this {
        if (!data) return this;
        this.pullBaseData(data)
            .setEpisodes(data.episodes)
        return this;
    }
}