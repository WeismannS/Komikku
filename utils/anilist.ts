import { tryFetch } from "./helper.ts";
import type { InternalPageMediaArgs, Media, QueryPageArgs } from "../types/MediaSchema.ts";
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
      title {
        userPreferred
      }
      coverImage {
        extraLarge
        large
        color
      }
      synonyms
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
      bannerImage
      description
      type
      format
      status(version: 2)
      chapters
      genres
      isAdult
      averageScore
      popularity
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
export class Anilist {
  constructor() {
  }

  async getTrending(perPage : number = 10) {
    const variables= {
      page:1,
      perPage,
      sort:["TRENDING_DESC"],
      type : "MANGA",
    }
    const options = {
      retryOnRateLimit: true,
      method: 'POST',
      headers: {
        'content-Type': 'application/json',
      },
      "body": JSON.stringify({
        "query" : searchQuery,
        variables
      }),
    };

    const { data, error } = await tryFetch(url, options, "json") as { data: any, error: any };
    if (error) return
    return data.data.Page.media;
  }


  async search(args?: InternalPageMediaArgs & QueryPageArgs ) : Promise<Media[] | undefined> {
    
    console.log(args)
    const options = {
      retryOnRateLimit: true,
      method: 'POST',
      headers: {
        'content-Type': 'application/json',
      },
      body: JSON.stringify({
        query : searchQuery,
        variables : args,
      }),
    };

    const { data, error } = await tryFetch(url, options, "json") as { data: any, error: any };
    if (error) return
    return data.data.Page.media;
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
      "query":"query($page:Int = 1 $id:Int $type:MediaType $isAdult:Boolean = false $search:String $format:[MediaFormat]$status:MediaStatus $countryOfOrigin:CountryCode $source:MediaSource $season:MediaSeason $seasonYear:Int $year:String $onList:Boolean $yearLesser:FuzzyDateInt $yearGreater:FuzzyDateInt $episodeLesser:Int $episodeGreater:Int $durationLesser:Int $durationGreater:Int $chapterLesser:Int $chapterGreater:Int $volumeLesser:Int $volumeGreater:Int $licensedBy:[Int]$isLicensed:Boolean $genres:[String]$excludedGenres:[String]$tags:[String]$excludedTags:[String]$minimumTagRank:Int $sort:[MediaSort]=[POPULARITY_DESC,SCORE_DESC]){Page(page:$page,perPage:20){pageInfo{total perPage currentPage lastPage hasNextPage}media(id:$id type:$type season:$season format_in:$format status:$status countryOfOrigin:$countryOfOrigin source:$source search:$search onList:$onList seasonYear:$seasonYear startDate_like:$year startDate_lesser:$yearLesser startDate_greater:$yearGreater episodes_lesser:$episodeLesser episodes_greater:$episodeGreater duration_lesser:$durationLesser duration_greater:$durationGreater chapters_lesser:$chapterLesser chapters_greater:$chapterGreater volumes_lesser:$volumeLesser volumes_greater:$volumeGreater licensedById_in:$licensedBy isLicensed:$isLicensed genre_in:$genres genre_not_in:$excludedGenres tag_in:$tags tag_not_in:$excludedTags minimumTagRank:$minimumTagRank sort:$sort isAdult:$isAdult){id title{userPreferred}coverImage{extraLarge large color}startDate{year month day}endDate{year month day}bannerImage season seasonYear description type format status(version:2)episodes duration chapters volumes genres isAdult averageScore popularity nextAiringEpisode{airingAt timeUntilAiring episode}mediaListEntry{id status}studios(isMain:true){edges{isMain node{id name}}}}}}",
      "variables":{
         "page":1,
         "type":"MANGA",
         "sort":[
            "TRENDING_DESC",
            "POPULARITY_DESC"
         ]
      }
   })
  };

  const { data, error } = await tryFetch(url, options, "json") as { data: any, error: any };
  if (error) return
  return data.data.Page.media[0];
}
