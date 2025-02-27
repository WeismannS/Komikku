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
`;

export async function tryFetch(url: string, options: RequestInit, func: "json" | "text") {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response[func]();
    return { data, error: null };
  } catch (error) {
    console.error('Error:', error);
    return { data: null, error };
  }
}

export async function fetchAnilistDetails(title: string) {
  const variables = {
    search: title,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  };

  const { data, error } = await tryFetch(url, options, "json");
  await sleep(100);
  if (error || !data) 
        return ;
  return data.data.Page.media[0];
}
