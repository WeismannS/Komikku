export class KomikkuError extends Error {
    constructor(
      message: string,
      public code: string,
      public source: 'ANILIST' | 'PROVIDER' | 'INTERNAL',
      public providerName?: string,
      public partial?: boolean, // Indicates if some data was successfully retrieved
      public cause?: Error
    ) {
      super(message);
      this.name = 'KomikkuError';
      
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, KomikkuError);
      }
    }
  }
  
  export const ErrorCodes = {
    API: 'API_ERROR',
    PARSING: 'PARSING_ERROR',
    PROVIDER_SPECIFIC: 'PROVIDER_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    METADATA_INCOMPLETE: 'METADATA_INCOMPLETE',
    UNKNOWN: 'UNKNOWN_ERROR'
  } as const;

  export interface Result<T> {
    data?: T;
    error?: KomikkuError;
  }