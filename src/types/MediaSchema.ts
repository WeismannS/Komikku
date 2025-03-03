export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** ISO 3166-1 alpha-2 country code */
  CountryCode: { input: any; output: any; }
  /** 8 digit long date integer (YYYYMMDD). Unknown dates represented by 0. E.g. 2016: 20160000, May 1976: 19760500 */
  FuzzyDateInt: { input: any; output: any; }
  Json: { input: any; output: any; }
};

/** Date object that allows for incomplete date values (fuzzy) */
export type FuzzyDate = {
  __typename?: 'FuzzyDate';
  /** Numeric Day (24) */
  day?: Maybe<Scalars['Int']['output']>;
  /** Numeric Month (3) */
  month?: Maybe<Scalars['Int']['output']>;
  /** Numeric Year (2017) */
  year?: Maybe<Scalars['Int']['output']>;
};

/** Anime or Manga */
export type Media = {
  __typename?: 'Media';
  /** The media's entire airing schedule */
  airingSchedule?: Maybe<AiringScheduleConnection>;
  /** If the media should have forum thread automatically created for it on airing episode release */
  autoCreateForumThread?: Maybe<Scalars['Boolean']['output']>;
  /** A weighted average score of all the user's scores of the media */
  averageScore?: Maybe<Scalars['Int']['output']>;
  /** The banner image of the media */
  bannerImage?: Maybe<Scalars['String']['output']>;
  /** The amount of chapters the manga has when complete */
  chapters?: Maybe<Scalars['Int']['output']>;
  /** The characters in the media */
  characters?: Maybe<CharacterConnection>;
  /** Where the media was created. (ISO 3166-1 alpha-2) */
  countryOfOrigin?: Maybe<Scalars['CountryCode']['output']>;
  /** The cover images of the media */
  coverImage?: Maybe<MediaCoverImage>;
  /** Short description of the media's story and characters */
  description?: Maybe<Scalars['String']['output']>;
  /** The general length of each anime episode in minutes */
  duration?: Maybe<Scalars['Int']['output']>;
  /** The last official release date of the media */
  endDate?: Maybe<FuzzyDate>;
  /** The amount of episodes the anime has when complete */
  episodes?: Maybe<Scalars['Int']['output']>;
  /** External links to another site related to the media */
  externalLinks?: Maybe<Array<Maybe<MediaExternalLink>>>;
  /** The amount of user's who have favourited the media */
  favourites?: Maybe<Scalars['Int']['output']>;
  /** The format the media was released in */
  format?: Maybe<MediaFormat>;
  /** The genres of the media */
  genres?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Official Twitter hashtags for the media */
  hashtag?: Maybe<Scalars['String']['output']>;
  /** The id of the media */
  id: Scalars['Int']['output'];
  /** The mal id of the media */
  idMal?: Maybe<Scalars['Int']['output']>;
  /** If the media is intended only for 18+ adult audiences */
  isAdult?: Maybe<Scalars['Boolean']['output']>;
  /** If the media is marked as favourite by the current authenticated user */
  isFavourite: Scalars['Boolean']['output'];
  /** If the media is blocked from being added to favourites */
  isFavouriteBlocked: Scalars['Boolean']['output'];
  /** If the media is officially licensed or a self-published doujin release */
  isLicensed?: Maybe<Scalars['Boolean']['output']>;
  /** Locked media may not be added to lists our favorited. This may be due to the entry pending for deletion or other reasons. */
  isLocked?: Maybe<Scalars['Boolean']['output']>;
  /** If the media is blocked from being recommended to/from */
  isRecommendationBlocked?: Maybe<Scalars['Boolean']['output']>;
  /** If the media is blocked from being reviewed */
  isReviewBlocked?: Maybe<Scalars['Boolean']['output']>;
  /** Mean score of all the user's scores of the media */
  meanScore?: Maybe<Scalars['Int']['output']>;
  /** The authenticated user's media list entry for the media */
  mediaListEntry?: Maybe<MediaList>;
  /** Notes for site moderators */
  modNotes?: Maybe<Scalars['String']['output']>;
  /** The number of users with the media on their list */
  popularity?: Maybe<Scalars['Int']['output']>;
  /** The season the media was initially released in */
  season?: Maybe<MediaSeason>;
  /** The season year the media was initially released in */
  seasonYear?: Maybe<Scalars['Int']['output']>;
  /** The url for the media page on the AniList website */
  siteUrl?: Maybe<Scalars['String']['output']>;
  /** Source type the media was adapted from. */
  source?: Maybe<MediaSource>;
  /** The first official release date of the media */
  startDate?: Maybe<FuzzyDate>;
  /** The current releasing status of the media */
  status?: Maybe<MediaStatus>;
  /** Data and links to legal streaming episodes on external sites */
  streamingEpisodes?: Maybe<Array<Maybe<MediaStreamingEpisode>>>;
  /** Alternative titles of the media */
  synonyms?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** List of tags that describes elements and themes of the media */
  tags?: Maybe<Array<Maybe<MediaTag>>>;
  /** The official titles of the media in various languages */
  title?: Maybe<MediaTitle>;
  /** Media trailer or advertisement */
  trailer?: Maybe<MediaTrailer>;
  /** The type of the media; anime or manga */
  type?: Maybe<MediaType>;
  /** When the media's data was last updated */
  updatedAt?: Maybe<Scalars['Int']['output']>;
  /** The amount of volumes the manga has when complete */
  volumes?: Maybe<Scalars['Int']['output']>;
};

export type MediaConnection = {
  __typename?: 'MediaConnection';
  edges?: Maybe<Array<Maybe<MediaEdge>>>;
  nodes?: Maybe<Array<Maybe<Media>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
};

export type MediaCoverImage = {
  __typename?: 'MediaCoverImage';
  /** Average #hex color of cover image */
  color?: Maybe<Scalars['String']['output']>;
  /** The cover image url of the media at its largest size. If this size isn't available, large will be provided instead. */
  extraLarge?: Maybe<Scalars['String']['output']>;
  /** The cover image url of the media at a large size */
  large?: Maybe<Scalars['String']['output']>;
  /** The cover image url of the media at medium size */
  medium?: Maybe<Scalars['String']['output']>;
};

/** Media connection edge */
export type MediaEdge = {
  __typename?: 'MediaEdge';
  node?: Maybe<Media>;
};

/** An external link to another site related to the media */
export type MediaExternalLink = {
  __typename?: 'MediaExternalLink';
  color?: Maybe<Scalars['String']['output']>;
  /** The icon image url of the site. Not available for all links. Transparent PNG 64x64 */
  icon?: Maybe<Scalars['String']['output']>;
  /** The id of the external link */
  id: Scalars['Int']['output'];
  isDisabled?: Maybe<Scalars['Boolean']['output']>;
  /** Language the site content is in. See Staff language field for values. */
  language?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  /** The links website site name */
  site: Scalars['String']['output'];
  /** The links website site id */
  siteId?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<ExternalLinkType>;
  /** The url of the external link or base url of link source */
  url?: Maybe<Scalars['String']['output']>;
};

/** The format the media was released in */
export type MediaFormat =
  | 'MANGA'
  | 'MOVIE'
  | 'MUSIC'
  | 'NOVEL'
  | 'ONA'
  | 'ONE_SHOT'
  | 'OVA'
  | 'SPECIAL'
  | 'TV'
  | 'TV_SHORT';

/** Media list item */
export type MediaList = {
  __typename?: 'MediaList';
  /** The id of the list entry */
  id: Scalars['Int']['output'];
  media?: Maybe<Media>;
  /** The id of the media */
  mediaId: Scalars['Int']['output'];
};

/** Media sort enums */
export type MediaSort =
  | 'CHAPTERS'
  | 'CHAPTERS_DESC'
  | 'DURATION'
  | 'DURATION_DESC'
  | 'END_DATE'
  | 'END_DATE_DESC'
  | 'EPISODES'
  | 'EPISODES_DESC'
  | 'FAVOURITES'
  | 'FAVOURITES_DESC'
  | 'FORMAT'
  | 'FORMAT_DESC'
  | 'ID'
  | 'ID_DESC'
  | 'POPULARITY'
  | 'POPULARITY_DESC'
  | 'SCORE'
  | 'SCORE_DESC'
  | 'SEARCH_MATCH'
  | 'START_DATE'
  | 'START_DATE_DESC'
  | 'STATUS'
  | 'STATUS_DESC'
  | 'TITLE_ENGLISH'
  | 'TITLE_ENGLISH_DESC'
  | 'TITLE_NATIVE'
  | 'TITLE_NATIVE_DESC'
  | 'TITLE_ROMAJI'
  | 'TITLE_ROMAJI_DESC'
  | 'TRENDING'
  | 'TRENDING_DESC'
  | 'TYPE'
  | 'TYPE_DESC'
  | 'UPDATED_AT'
  | 'UPDATED_AT_DESC'
  | 'VOLUMES'
  | 'VOLUMES_DESC';

export type MediaSeason =
  | 'FALL'
  | 'SPRING'
  | 'SUMMER'
  | 'WINTER';

/** Source type the media was adapted from */
export type MediaSource =
  | 'ANIME'
  | 'COMIC'
  | 'DOUJINSHI'
  | 'GAME'
  | 'LIGHT_NOVEL'
  | 'LIVE_ACTION'
  | 'MANGA'
  | 'MULTIMEDIA_PROJECT'
  | 'NOVEL'
  | 'ORIGINAL'
  | 'OTHER'
  | 'PICTURE_BOOK'
  | 'VIDEO_GAME'
  | 'VISUAL_NOVEL'
  | 'WEB_NOVEL';

/** The current releasing status of the media */
export type MediaStatus =
  | 'CANCELLED'
  | 'FINISHED'
  | 'HIATUS'
  | 'NOT_YET_RELEASED'
  | 'RELEASING';

/** Data and links to legal streaming episodes on external sites */
export type MediaStreamingEpisode = {
  __typename?: 'MediaStreamingEpisode';
  /** The site location of the streaming episodes */
  site?: Maybe<Scalars['String']['output']>;
  /** Url of episode image thumbnail */
  thumbnail?: Maybe<Scalars['String']['output']>;
  /** Title of the episode */
  title?: Maybe<Scalars['String']['output']>;
  /** The url of the episode */
  url?: Maybe<Scalars['String']['output']>;
};

/** A tag that describes a theme or element of the media */
export type MediaTag = {
  __typename?: 'MediaTag';
  /** The categories of tags this tag belongs to */
  category?: Maybe<Scalars['String']['output']>;
  /** A general description of the tag */
  description?: Maybe<Scalars['String']['output']>;
  /** The id of the tag */
  id: Scalars['Int']['output'];
  /** If the tag is only for adult 18+ media */
  isAdult?: Maybe<Scalars['Boolean']['output']>;
  /** If the tag could be a spoiler for any media */
  isGeneralSpoiler?: Maybe<Scalars['Boolean']['output']>;
  /** If the tag is a spoiler for this media */
  isMediaSpoiler?: Maybe<Scalars['Boolean']['output']>;
  /** The name of the tag */
  name: Scalars['String']['output'];
  /** The relevance ranking of the tag out of the 100 for this media */
  rank?: Maybe<Scalars['Int']['output']>;
  /** The user who submitted the tag */
  userId?: Maybe<Scalars['Int']['output']>;
};

/** The official titles of the media in various languages */
export type MediaTitle = {
  __typename?: 'MediaTitle';
  /** The official english title */
  english?: Maybe<Scalars['String']['output']>;
  /** Official title in it's native language */
  native?: Maybe<Scalars['String']['output']>;
  /** The romanization of the native language title */
  romaji?: Maybe<Scalars['String']['output']>;
  /** The currently authenticated users preferred title language. Default romaji for non-authenticated */
  userPreferred?: Maybe<Scalars['String']['output']>;
};

/** Media trailer or advertisement */
export type MediaTrailer = {
  __typename?: 'MediaTrailer';
  /** The trailer video id */
  id?: Maybe<Scalars['String']['output']>;
  /** The site the video is hosted by (Currently either youtube or dailymotion) */
  site?: Maybe<Scalars['String']['output']>;
  /** The url for the thumbnail image of the video */
  thumbnail?: Maybe<Scalars['String']['output']>;
};

/** Media type enum, anime or manga. */
export type MediaType =
  | 'ANIME'
  | 'MANGA';

export type ExternalLinkType =
  | 'INFO'
  | 'SOCIAL'
  | 'STREAMING';

/** The pagination information */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** The current page */
  currentPage?: Maybe<Scalars['Int']['output']>;
  /** If there is another page */
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  /** The last page */
  lastPage?: Maybe<Scalars['Int']['output']>;
  /** The count on a page */
  perPage?: Maybe<Scalars['Int']['output']>;
  /** The total number of items. Note: This value is not guaranteed to be accurate, do not rely on this for logic */
  total?: Maybe<Scalars['Int']['output']>;
};

/** Connection for character data */
export type CharacterConnection = {
  __typename?: 'CharacterConnection';
  edges?: Maybe<Array<Maybe<CharacterEdge>>>;
  nodes?: Maybe<Array<Maybe<Character>>>;
  pageInfo?: Maybe<PageInfo>;
};

/** Character connection edge */
export type CharacterEdge = {
  __typename?: 'CharacterEdge';
  node?: Maybe<Character>;
};

/** Airing schedule connection */
export type AiringScheduleConnection = {
  __typename?: 'AiringScheduleConnection';
  edges?: Maybe<Array<Maybe<AiringScheduleEdge>>>;
  nodes?: Maybe<Array<Maybe<AiringSchedule>>>;
  pageInfo?: Maybe<PageInfo>;
};

/** AiringSchedule connection edge */
export type AiringScheduleEdge = {
  __typename?: 'AiringScheduleEdge';
  node?: Maybe<AiringSchedule>;
};

/** Media Airing Schedule */
export type AiringSchedule = {
  __typename?: 'AiringSchedule';
  /** The time the episode airs at */
  airingAt: Scalars['Int']['output'];
  /** The airing episode number */
  episode: Scalars['Int']['output'];
  /** The id of the airing schedule item */
  id: Scalars['Int']['output'];
  /** The associate media of the airing episode */
  media?: Maybe<Media>;
  /** The associate media id of the airing episode */
  mediaId: Scalars['Int']['output'];
  /** Seconds until episode starts airing */
  timeUntilAiring: Scalars['Int']['output'];
};

type CharacterImage = {
  large?: Maybe<Scalars['String']['output']>

  medium?: Maybe<Scalars['String']['output']>
}
/** A character */
export type Character = {
  __typename?: 'Character';
  /** The id of the character */
  id: Scalars['Int']['output'];
  /** The name of the character */
  name?: Maybe<CharacterName>;
  gender?: Maybe<Scalars['String']['output']>;
  image?: Maybe<CharacterImage>;
};

/** The names of the character */
export type CharacterName = {
  __typename?: 'CharacterName';
  /** The character's first and last name */
  full?: Maybe<Scalars['String']['output']>;
  /** The character's given name */
  first?: Maybe<Scalars['String']['output']>;
  /** The character's surname */
  last?: Maybe<Scalars['String']['output']>;
};

export type InternalPageMediaArgs = {
  averageScore?: InputMaybe<Scalars['Int']['input']>;
  averageScore_greater?: InputMaybe<Scalars['Int']['input']>;
  averageScore_lesser?: InputMaybe<Scalars['Int']['input']>;
  averageScore_not?: InputMaybe<Scalars['Int']['input']>;
  chapters?: InputMaybe<Scalars['Int']['input']>;
  chapters_greater?: InputMaybe<Scalars['Int']['input']>;
  chapters_lesser?: InputMaybe<Scalars['Int']['input']>;
  countryOfOrigin?: InputMaybe<Scalars['CountryCode']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  duration_greater?: InputMaybe<Scalars['Int']['input']>;
  duration_lesser?: InputMaybe<Scalars['Int']['input']>;
  endDate?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  endDate_greater?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  endDate_lesser?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  endDate_like?: InputMaybe<Scalars['String']['input']>;
  episodes?: InputMaybe<Scalars['Int']['input']>;
  episodes_greater?: InputMaybe<Scalars['Int']['input']>;
  episodes_lesser?: InputMaybe<Scalars['Int']['input']>;
  format?: InputMaybe<MediaFormat>;
  format_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  format_not?: InputMaybe<MediaFormat>;
  format_not_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  genre?: InputMaybe<Scalars['String']['input']>;
  genre_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  genre_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  idMal?: InputMaybe<Scalars['Int']['input']>;
  idMal_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  idMal_not?: InputMaybe<Scalars['Int']['input']>;
  idMal_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id_not?: InputMaybe<Scalars['Int']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  isAdult?: InputMaybe<Scalars['Boolean']['input']>;
  isLicensed?: InputMaybe<Scalars['Boolean']['input']>;
  licensedBy?: InputMaybe<Scalars['String']['input']>;
  licensedById?: InputMaybe<Scalars['Int']['input']>;
  licensedById_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  licensedBy_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  minimumTagRank?: InputMaybe<Scalars['Int']['input']>;
  onList?: InputMaybe<Scalars['Boolean']['input']>;
  popularity?: InputMaybe<Scalars['Int']['input']>;
  popularity_greater?: InputMaybe<Scalars['Int']['input']>;
  popularity_lesser?: InputMaybe<Scalars['Int']['input']>;
  popularity_not?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  season?: InputMaybe<MediaSeason>;
  seasonYear?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
  source?: InputMaybe<MediaSource>;
  source_in?: InputMaybe<Array<InputMaybe<MediaSource>>>;
  startDate?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startDate_greater?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startDate_lesser?: InputMaybe<Scalars['FuzzyDateInt']['input']>;
  startDate_like?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MediaStatus>;
  status_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  status_not?: InputMaybe<MediaStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  tag?: InputMaybe<Scalars['String']['input']>;
  tagCategory?: InputMaybe<Scalars['String']['input']>;
  tagCategory_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tagCategory_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tag_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tag_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  type?: InputMaybe<MediaType>;
  volumes?: InputMaybe<Scalars['Int']['input']>;
  volumes_greater?: InputMaybe<Scalars['Int']['input']>;
  volumes_lesser?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryPageArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};
