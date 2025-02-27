

import { Komikku } from "./lib.ts";





const komikku = new Komikku();


console.log(await  ((await komikku.providers.MangaDex.fetchMangaList()).length));