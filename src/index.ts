import { DemonicProvider } from "./models/DemonicProvider.ts";
import type { Provider } from "./models/Provider.ts";
import type { Manga } from "./types/interface.ts";
import type { Media } from "./types/MediaSchema.ts";
import { Anilist } from "./utils/anilist.ts";





type providers = "Demonicscans" ;
export type {Manga, Provider, Media, }
export class Komikku {
    providers: Record<providers, Provider>;
    Anilist : Anilist = new Anilist();
    constructor() {
        this.providers = {
            "Demonicscans": new DemonicProvider()
        }
    }
    async search(title: string, options?: { providers?: providers[], limitManga?: number }): Promise<Manga[]> {
        let manga_list: Manga[] = [];
        const providersList = options?.providers || Object.keys(this.providers) as providers[];
        for (let provider of providersList) {
            const manga = await this.providers[provider].search(title, options?.limitManga);
            if (!manga) continue;
            manga_list = manga_list.concat(manga);
        }
        return manga_list;
    }
    
}