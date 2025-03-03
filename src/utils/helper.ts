import {
    setTimeout as sleep 
} from "node:timers/promises"
export {sleep}
export async function tryFetch(url: string, options: RequestInit & {retryOnRateLimit? : boolean}, func: "json" | "text")
 : Promise<{data : any, error : null} | {data : null, error : Error}> {
  try {
    console.log(url);
    const response = await fetch(url, options);
    if (!response.ok) {
      const retryAfter = response.headers.get('Retry-After');
      if (response.status === 429  || retryAfter) {
        console.error(`Rate limited! Status: ${response.status}, ${url}`);
        
        if (retryAfter && options.retryOnRateLimit)
        {
          await sleep(parseInt(retryAfter) * 1000);
          return tryFetch(url, options, func);
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status} in ${url}`);
      }
    }
    const data = await response[func]();
    return { data, error: null };
  } catch (error) {
    console.error('Error:', error);
    let e  = error as Error;
    return { data: null,  error : e };
  }
}
