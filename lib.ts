import { DemonicProvider } from "./models/DemonicProvider.ts";
import type { Provider } from "./models/Provider.ts";





type providers = "Demonicscans" ;

export class Komikku {
    providers: Record<providers, Provider>;
    constructor() {
        this.providers = {
            "Demonicscans": new DemonicProvider()
        }
    }
}