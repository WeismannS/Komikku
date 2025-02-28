import { setTimeout as sleep } from "node:timers/promises";

const url = 'https://graphql.anilist.co';
const query = `
query ($search: String!) {
  Page {
    media(search: $search, type: MANGA) {
      id
      title {
        romaji
        english
        native
      }
      genres
      tags {
        name
      }
      startDate {
        day
        year
        month
      }
      source
      status
      format
      synonyms
      description
      updatedAt
      coverImage {
        large
      }
      characters {
        nodes {
          name {
            first
            last
            full
          }
          gender
          image 
          {
            medium
          }
        }
      }
    }
  }
}
`
;

export async function tryFetch(url: string, options: RequestInit & {retryOnRateLimit? : boolean}, func: "json" | "text") {
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
    return { data: null, error };
  }
}

export async function anilistFetch(title: string) {
  const variables = {
    search: title,
  };

  const options = {
    retryOnRateLimit: true,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  };

  const { data, error } = await tryFetch(url, options, "json") as { data: any, error: any };

  return data.data.Page.media[0];
}
