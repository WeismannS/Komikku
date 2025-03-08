import {
    setTimeout as sleep 
} from "node:timers/promises"
export {sleep}
export async function tryFetch(url: string, options: RequestInit & {retryOnRateLimit? : boolean}, func: "json" | "text")
 // deno-lint-ignore no-explicit-any
 : Promise<{data : any, error : null} | {data : null, error : Error}> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const retryAfter = response.headers.get('Retry-After');
      if (response.status === 429  || retryAfter) {        
        if (retryAfter && options.retryOnRateLimit)
        {
          console.log(`Rate limited! Retrying after ${retryAfter} seconds...`);
          await sleep(parseInt(retryAfter) * 1000);
          console.log("Retrying...");
          return tryFetch(url, options, func);
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status} in ${url}`);
      }
    }
    const data = await response[func]();
    return { data, error: null };
  } catch (error) {
    return { data: null,  error : error as Error };
  }
}
