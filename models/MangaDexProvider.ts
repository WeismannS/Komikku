import { Chapter } from "../utils/types.ts";
import { Provider } from "./Provider.ts";
import { Manga } from "../utils/interface.ts";
import { fetchAnilistDetails, tryFetch } from "../utils/anilist.ts";
import { setTimeout as sleep } from "node:timers/promises";

export class MangaDexProvider extends Provider {
    apiBaseURL: string;

    constructor() {
        super("MangaDex", "https://mangadex.org");
        this.apiBaseURL = "https://api.mangadex.org";
    }

    async getPages(chapter: Chapter): Promise<string[]> {
        const chapterId = chapter.url.split('/').pop() || "";
        
        const { data: chapterData, error: chapterError } = await tryFetch(
            `${this.apiBaseURL}/at-home/server/${chapterId}`,
            {},
            "json"
        );
        
        if (chapterError || !chapterData) return [];
        
        const baseUrl = chapterData.baseUrl;
        const chapter_hash = chapterData.chapter.hash;
        const data = chapterData.chapter.data;
        
        const images: string[] = data.map((filename: string) => 
            `${baseUrl}/data/${chapter_hash}/${filename}`
        );
        
        return images;
    }

    async getChapters(manga: Manga): Promise<Chapter[]> {
        // extract manga ID from URL
        const mangaId = manga.url.split('/').pop() || "";
        
        const chapters: Chapter[] = [];
        let offset = 0;
        const limit = 100;
        let hasMoreChapters = true;
        
        while (hasMoreChapters) {
            const { data: chaptersData, error: chaptersError } = await tryFetch(
                `${this.apiBaseURL}/manga/${mangaId}/feed?limit=${limit}&offset=${offset}&order[chapter]=asc&translatedLanguage[]=en`,
                {},
                "json"
            );
            
            if (chaptersError || !chaptersData || !chaptersData.data || chaptersData.data.length === 0) {
                hasMoreChapters = false;
                continue;
            }
            
            for (const chapterData of chaptersData.data) {
                const attributes = chapterData.attributes;
                const relationships = chapterData.relationships;
                
                const chapterNum = attributes.chapter || "0";
                const volume = attributes.volume ? `Vol.${attributes.volume} ` : "";
                const chapterTitle = attributes.title || "";
                const title = `${volume}Chapter ${chapterNum}${chapterTitle ? `: ${chapterTitle}` : ""}`;
                
                const url = `/chapter/${chapterData.id}`;
                
                const date = new Date(attributes.publishAt);
                
                const chapter = new Chapter(manga, title, url, date);
                chapters.push(chapter);
            }
            
            offset += chaptersData.data.length;
            
            if (chaptersData.data.length < limit) {
                hasMoreChapters = false;
            }
            
            // for API rate limits
            await sleep(300);
        }
        
        manga.setChapters(chapters);
        return chapters;
    }

    async fetchMangaList(): Promise<Manga[]> {
        const limit = 10;
        let offset = 0;
        let hasMoreManga = true;
    
        while (hasMoreManga) {
            console.log(`Fetching manga list from offset ${offset}...`);
            const { data: mangaListData, error: mangaListError } = await tryFetch(
                `${this.apiBaseURL}/manga?limit=${limit}&offset=${offset}&contentRating[]=safe&contentRating[]=suggestive&order[relevance]=desc`,
                {},
                "json"
            );
    
            if (mangaListError || !mangaListData || !mangaListData.data || mangaListData.data.length === 0) {
                hasMoreManga = false;
                continue;
            }
    
            for (const mangaData of mangaListData.data) {
                const attributes = mangaData.attributes;
    
                const title = attributes.title.en ||
                    attributes.title[Object.keys(attributes.title)[0]] ||
                    "Unknown Title";
    
                const url = `/manga/${mangaData.id}`;
    
                const manga = await this.search(title);
                if (manga) {
                    this.manga_list.push(manga);
                }
                await sleep(1000);
            }
    
            offset += mangaListData.data.length;
    
            if (mangaListData.data.length < limit) {
                hasMoreManga = false;
            }
        }
    
        return this.manga_list;
    }
    
    async search(title: string): Promise<Manga | undefined> {
        const { data: searchData, error: searchError } = await tryFetch(
            `${this.apiBaseURL}/manga?title=${encodeURIComponent(title)}&limit=1&order[relevance]=desc`,
            {},
            "json"
        );
        
        if (searchError || !searchData || !searchData.data || searchData.data.length === 0) return;
        
        const mangaData = searchData.data[0];
        const mangaId = mangaData.id;
        const attributes = mangaData.attributes;
        
        const manga = new Manga(this);
        
        manga.setTitle(attributes.title.en || Object.values(attributes.title)[0] || "")
            .setUrl(`/manga/${mangaId}`);
        
        const { data: detailsData, error: detailsError } = await tryFetch(
            `${this.apiBaseURL}/manga/${mangaId}?includes[]=author&includes[]=artist&includes[]=cover_art`,
            {},
            "json"
        );
        
        if (detailsError || !detailsData) return manga;
        
        const coverRelationship = detailsData.data.relationships.find(
            (rel: any) => rel.type === "cover_art"
        );
        
        let coverFilename = "";
        if (coverRelationship && coverRelationship.attributes) {
            coverFilename = coverRelationship.attributes.fileName;
        }
        
        const coverUrl = coverFilename 
            ? `https://uploads.mangadex.org/covers/${mangaId}/${coverFilename}`
            : "";
        
        const authors = detailsData.data.relationships
            .filter((rel: any) => rel.type === "author" || rel.type === "artist")
            .map((rel: any) => rel.attributes?.name || "Unknown")
            .filter((name: string) => name !== "Unknown");
        
        const status: any = attributes.status?.toUpperCase() || "UNKNOWN";
        const description = attributes.description.en || Object.values(attributes.description)[0] || "";
        const tags = attributes.tags.map((tag: any) => tag.attributes.name.en || "");
        const updatedAt = new Date(attributes.updatedAt || attributes.createdAt);
        const createdAt = new Date(attributes.createdAt);
        
        manga.setCover(coverUrl)
            .setAuthors(authors)
            .setStatus(status)
            .setDescription(description)
            .setTags(tags)
            .setUpdatedAt(updatedAt)
            .setCreatedAt(createdAt);
        
        const anilistData = await fetchAnilistDetails(title);
        if (anilistData) {
            manga.setSynonyms(anilistData.synonyms || [])
                .setGenres(anilistData.genres || [])
                .setRating(anilistData.averageScore || 0)
                .setSource(anilistData.source || "UNKNOWN")
                .setCharacters(anilistData.characters.nodes.map(
                    (character: { name: { full: string; first: string, last: string }, gender: string, image: any }) => ({
                        ...character.name,
                        gender: character.gender,
                        image: character.image.medium
                    })
                ));
        }
        
        await this.getChapters(manga);
        
        return manga;
    }
}
