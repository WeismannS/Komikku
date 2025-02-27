

import { Komikku } from "./lib.ts";





const komikku = new Komikku();

const manga = await komikku.providers.Demonicscans.search("Solo Leveling")

const chapters = await manga?.getChapters();
if (chapters)
    console.log(await chapters[0].getPages()  );