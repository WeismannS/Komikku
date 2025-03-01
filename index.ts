

import { Komikku } from "./lib.ts";
import { MediaSort, MediaType } from "./types/MediaSchema.ts";
import { Anilist, anilistFetch } from "./utils/anilist.ts";





// const komikku = new Komikku();


// {
//     console.log(await komikku.providers.Demonicscans.getTrending());
    
// }

const anilist = new Anilist()


console.log(await anilist.search({
    "perPage": 2,
    "type": MediaType.Manga,
    "sort" : [MediaSort.Trending],
    "genre_in" : ["ROMANCE", "ecchi","Action"]
  }))