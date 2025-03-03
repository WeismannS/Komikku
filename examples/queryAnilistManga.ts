import {Komikku} from "../src/index.ts";


const {data : manga, error} = await new Komikku().providers.Demonicscans.search("One shot", 1)

if (manga && manga[0]) {
    console.log(await manga[0])}
