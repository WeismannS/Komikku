

import { Komikku } from "./lib.ts";





const komikku = new Komikku();


console.log(await  komikku.providers.MangaDex.search("one piece"));