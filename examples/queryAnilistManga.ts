import {Komikku} from "../src/index.ts";


const mangas = await new Komikku().providers.Demonicscans.fetchMangaList()
console.log(mangas)