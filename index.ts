

import { Komikku } from "./lib.ts";





const komikku = new Komikku();
const manga_list = await  komikku.search("loved by villians", { providers: ["Demonicscans"], limitManga: 1 });