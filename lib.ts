import { DemonicProvider } from "./models/DemonicProvider.ts";
import { MangaDexProvider } from "./models/MangaDexProvider.ts";
import type { Provider } from "./models/Provider.ts";





type providers = "Demonicscans" | "MangaDex";

export class Komikku {
    providers: Record<providers, Provider>;
    constructor() {
        this.providers = {
            "Demonicscans": new DemonicProvider(),
            "MangaDex" : new MangaDexProvider()
        }
    }
}