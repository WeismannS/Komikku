import { tryFetch } from "./helper.ts";
import { MediaType, type InternalPageMediaArgs, type Media, type QueryPageArgs } from "../types/MediaSchema.ts";
import {Anime, Manga } from "../types/interface.ts";
const url = 'https://graphql.anilist.co';

const searchQuery = `
   query (
  $page: Int = 1
  $id: Int
  $perPage : Int
  $type: MediaType
  $isAdult: Boolean = false
  $search: String
  $format_in: [MediaFormat]
  $status: MediaStatus
  $countryOfOrigin: CountryCode
  $source: MediaSource
  $season: MediaSeason
  $seasonYear: Int
  $startDate_like: String
  $onList: Boolean
  $startDate_lesser: FuzzyDateInt
  $startDate_greater: FuzzyDateInt
  $episodes_lesser: Int
  $episodes_greater: Int
  $duration_lesser: Int
  $duration_greater: Int
  $chapters_lesser: Int
  $chapters_greater: Int
  $volumes_lesser: Int
  $volumes_greater: Int
  $licensedById_in: [Int]
  $isLicensed: Boolean
  $genre_in: [String]
  $genre_not_in: [String]
  $tag_in: [String]
  $tag_not_in: [String]
  $minimumTagRank: Int
  $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]
) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(
      id: $id
      type: $type
      season: $season
      format_in: $format_in
      status: $status
      countryOfOrigin: $countryOfOrigin
      source: $source
      search: $search
      onList: $onList
      seasonYear: $seasonYear
      startDate_like: $startDate_like
      startDate_lesser: $startDate_lesser
      startDate_greater: $startDate_greater
      episodes_lesser: $episodes_lesser
      episodes_greater: $episodes_greater
      duration_lesser: $duration_lesser
      duration_greater: $duration_greater
      chapters_lesser: $chapters_lesser
      chapters_greater: $chapters_greater
      volumes_lesser: $volumes_lesser
      volumes_greater: $volumes_greater
      licensedById_in: $licensedById_in
      isLicensed: $isLicensed
      genre_in: $genre_in
      genre_not_in: $genre_not_in
      tag_in: $tag_in
      tag_not_in: $tag_not_in
      minimumTagRank: $minimumTagRank
      sort: $sort
      isAdult: $isAdult
    ) {
      id
      source
      averageScore
      popularity
      bannerImage
      description
      duration
      type
      idMal
      favourites
      idMal
      synonyms
      format
      countryOfOrigin
      status(version: 2)
      chapters
      genres
      isAdult
      volumes
      siteUrl
      tags {
        name
        }
      title {
        userPreferred
        english
      }
      coverImage {
        extraLarge
        large
        color
      }
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      externalLinks {
        url
        site
      }
      trailer {
        id
        site
      }
      airingSchedule {
        edges {
          node {
            episode
          }
        }
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
      mediaListEntry {
        id
        status
      }
      studios(isMain: true) {
        edges {
          isMain
          node {
            id
            name
          }
        }
      }
    }
  }
}
`

type mangaSearchArgs = InternalPageMediaArgs & QueryPageArgs & {type : MediaType.Manga}
type animeSearchArgs = InternalPageMediaArgs & QueryPageArgs & {type : MediaType.Anime}
type mediaSearchArgs = InternalPageMediaArgs & QueryPageArgs & {type : MediaType.Anime | MediaType.Manga}
export class Anilist {
  constructor() {
  }
  // an abstraction to fetch the trending anime/manga
  async getTrending(perPage: number = 10): Promise<Media[] | undefined> {
    const variables = {
      page: 1,
      perPage,
      sort: ["TRENDING_DESC"],
      type: "MANGA",
    }
    const options = {
      retryOnRateLimit: true,
      method: 'POST',
      headers: {
        'content-Type': 'application/json',
      },
      "body": JSON.stringify({
        "query": searchQuery,
        variables
      }),
    };

    const { data, error } = await tryFetch(url, options, "json") as { data: any, error: any };
    if (error) return
    return data.data.Page.media;
  }

  async search(args: animeSearchArgs,): Promise<Anime[] | undefined>;
  async search(args: mangaSearchArgs): Promise<Manga[] | undefined>;
  async search(args: mediaSearchArgs): Promise<Anime[] | Manga[] | undefined> {
    const options = {
      retryOnRateLimit: true,
      method: 'POST',
      headers: {
        'content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchQuery,
        variables: args,
      }),
    };

    const { data, error } = await tryFetch(url, options, "json") as { data: any, error: any };
    if (error) return
    
    return  data.data.Page.media.map((media: Media) =>   new Manga().pullData(media) );
}
}

