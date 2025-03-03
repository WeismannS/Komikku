import type { Provider } from "../models/Provider.ts"
import type { Chapter } from "../types/types.ts"
import { type MediaStatus, type Maybe, type Media, type MediaTag, type FuzzyDate } from "./MediaSchema.ts"

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
    idMAL?:Nullable<number>;
    title?:Nullable<string>;
    popularity?: Nullable<number>;
    favorites?: Nullable<number>;
    description?: Nullable<Media["description"]>;
    Synonyms?: Nullable<Media["synonyms"]>;
    authors?:Nullable<string[]>;
    genres?:Nullable<Media["genres"]>;
    status?: Nullable<Media["status"]>;
    isAdult?:Nullable<boolean>;
    started_at?:Nullable<Date>;
    ended_at?:Nullable<Date>;
    updated_at?:Nullable<Date>;
    cover?:Nullable<string>;
    url?:Nullable<string>;
    rating?:Nullable<number>;
    source?: Nullable<Media["source"]>;
    Tags?:Nullable<string[]>;
    characters?:Nullable<Character[]>;
    provider?:Nullable<Provider>;
    aniURL?:Nullable<string>;
    countryOfOrigin?:Nullable<string>;
    season?: string;
    seasonYear?: number;
    constructor(provider?:Provider) {
        this.title = "";
        this.Synonyms = [];
        this.authors = [];
        this.genres = [];
        this.status = undefined;
        this.description = "";
        this.started_at = new Date();
        this.ended_at = new Date();
        this.updated_at = new Date();
        this.cover = "";
        this.url = "";
        this.rating = 0;
        this.source = undefined;
        this.Tags = [];
        this.characters = [];
        this.provider = provider;
        this.countryOfOrigin = "";
    }
    setTitle(title: Nullable<string>): this  {
        this.title = title ?? "";
        return this;
    }
    setSynonyms(Synonyms: Maybe<Maybe<string>[]> | Nullable<string[]> | undefined): this {
        this.Synonyms = Synonyms ?? [];
        return this;
    }

    setGenres(genres: Nullable<string[]> | undefined): this {
        this.genres = genres ?? [];
        return this;
    }

    setStatus(status: Media["status"] ): this {
        this.status = status;
        return this;
    }
    setPopularity(popularity: Nullable<number>): this {
        this.popularity = popularity || 0;
        return this;
    }
    setDescription(description: Nullable<string>): this {
        this.description = description ?? "";
        return this;
    }
    setStartedAt(created_at: Date): this {
        this.started_at = created_at ?? new Date();
        return this;
    }
    setEndedAt(ended_at: Date): this {
        this.ended_at = ended_at ?? new Date();
        return this;
    }
    setUpdatedAt(updated_at: Nullable<Date>): this {
        this.updated_at = updated_at ?? new Date();
        return this;
    }

    setCover(cover: Nullable<string>): this {
        this.cover = cover ?? "";
        return this;
    }
    setIdMAL(url?: Maybe<number>): this {
        this.idMAL = url ?? 0;
        return this;
    }
    setUrl(url: string): this {
        this.url = url ?? "";
        return this;
    }
    setRating(rating: Nullable<number>): this {
        this.rating = rating ?? 0;
        return this;
    }
    setSource(source: Media["source"]): this {
        this.source = source
        return this;
    }
    setTags(Tags: string[]): this {
        this.Tags = Tags ?? [];
        return this;
    }
    setCharacters(character: Character[]): this {
        this.characters = character ?? [];
        return this;
    }
    setProvider(provider: Provider): this {
        this.provider = provider;
        return this;
    }
    setAdult(isAdult: Nullable<boolean>): this {
        this.isAdult = isAdult;
        return this;
    }
    setaniURL(aniURL: Nullable<string>): this {
        this.aniURL = aniURL;
        return this;
    }
    setCountryOfOrigin(countryOfOrigin: Nullable<string>): this {
        this.countryOfOrigin = countryOfOrigin ?? "";
        return this;
    }
    setFavourites(favourites: Nullable<number>): this {
        this.favorites = favourites ?? 0;
        return this
    }
    setSeason(season: Nullable<string>): this {
        this.season = season || undefined;
        return this;
    }
    setSeasonYear(year: Nullable<number>): this {
        this.seasonYear = year || undefined;
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
        this.setTitle(data.title?.english || data.title?.romaji || data.title?.native || "")
            .setSynonyms(data.synonyms)
            .setGenres(data.genres?.filter((genre): genre is string => genre !== null && genre !== undefined) as string[])
            .setStatus(data.status)
            .setDescription(data.description ?? "")
            .setStartedAt(started_at)
            .setEndedAt(ended_at)
            .setCover(data.coverImage?.large)
            .setRating(data.averageScore)
            .setSource(data.source)
            .setTags(tags)
            .setCharacters(characters)
            .setIdMAL(data.idMal)
            .setAdult(data.isAdult)
            .setaniURL(data.siteUrl)
            .setCountryOfOrigin(data.countryOfOrigin)
            .setPopularity(data.popularity)
            .setFavourites(data.favourites)
            .setSeason(data.season)
            .setSeasonYear(data.seasonYear)
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
    Chapters: Chapter[];
    chaptersAvailable: number;
    volumes: Nullable<number>;
    constructor(provider?: Provider) {
        super(provider);
        this.Chapters = [];
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
        this.Chapters = Chapters;
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
        .setVolumes(data?.volumes)
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