

import { Komikku } from "./lib.ts";





const komikku = new Komikku();
const manga_list = await  komikku.providers.Demonicscans.search("Hunter")
if (manga_list)
    manga_list.forEach(manga => console.log(manga.title))