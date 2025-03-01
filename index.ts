

import { Komikku } from "./lib.ts";
import { DemonicProvider } from "./models/DemonicProvider.ts";
import { Manga } from "./types/interface.ts";
import { MediaSort, MediaType } from "./types/MediaSchema.ts";
import { Anilist } from "./utils/anilist.ts";





// const komikku = new Komikku();


// {
//     console.log(await komikku.providers.Demonicscans.getTrending());
    
// }

const anilist = new Anilist()

const manga = await (await new Komikku().search("one piece", {providers : ["Demonicscans"], limitManga : 1}))[0]
if (manga)
    console.log(manga, (await manga.getChapters()))