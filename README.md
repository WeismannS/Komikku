Collecting workspace information# Komikku

A Type-Safe TypeScript-based Interface library that provides a unified API for fetching manga data from various sources.

## Features

- 🌐 **Unified API**: Access manga from multiple sources with a consistent interface
- 🔍 **Search**: Find manga across different providers
- 📊 **Trending**: Get currently trending manga
- 📖 **Chapter Management**: Fetch chapters and page images
- 📱 **Integration**: AniList integration for enhanced metadata
- 🛠️ **Extensible**: Architecture designed for easy addition of new providers

## Installation

The only dependency Komikku requires is [@jsr/dom-deno](https://jsr.io/@b-fuze/deno-dom):

```bash
# For Bun:
bun install

# For Node:
npm install

# For Deno:
deno install
```

If you encounter an error, try explicitly installing the package:

```bash
# For Bun:
bun add @b-fuze/deno-dom@npm:@jsr/b-fuze__deno-dom
```

## Usage

### Basic Usage

```typescript
import { Komikku } from "./lib.ts";

// Initialize the Komikku client
const komikku = new Komikku();

// Get trending manga from DemonicScans
const trendingManga = await komikku.providers.Demonicscans.getTrending();
```

### Search for Manga

```typescript
// Search across all providers
const results = await komikku.search("One Piece");

// Search with specific providers and limit
const limitedResults = await komikku.search("Naruto", {
  providers: ["Demonicscans"],
  limitManga: 5
});

// Get chapters for a manga
const manga = results[0];
const chapters = await manga.getChapters();
```

### Fetch Chapter Pages

```typescript
// Get a specific chapter
const manga = await komikku.search("One Piece", { limitManga: 1 });
const chapters = await manga[0].getChapters();
const firstChapter = chapters[0];

// Get the pages for a chapter
const pages = await firstChapter.getPages();
```

### AniList Integration

```typescript
import { Anilist } from "./utils/anilist.ts";
import { MediaType } from "./types/MediaSchema.ts";

// Search for manga using AniList
const anilist = new Anilist();
const searchResults = await anilist.search({
  search: "One Piece", 
  type: MediaType.Manga,
  perPage: 5
});
```

## Architecture

### Core Components

- **Komikku**: Main client class that handles providers and provides a unified search interface.
- **Provider**: Abstract base class that all manga providers must implement.
- **DemonicProvider**: Implementation of the Provider interface for DemonicScans.

### Data Models

- **Manga**: Represents a manga with properties like title, authors, chapters, etc.
- **Chapter**: Represents a manga chapter with methods to fetch and manage pages.

### Utilities

- **Anilist**: Fetch manga metadata from AniList GraphQL API.
- **Helper**: Utility functions for HTTP requests with retry logic.

## Currently Supported Providers

- DemonicScans

## Adding a New Provider

To add a new provider, create a new class that extends `Provider` and implements all required abstract methods:

```typescript
import { Provider } from "./models/Provider.ts";
import { Manga } from "./types/interface.ts";
import { Chapter } from "./types/types.ts";

export class NewProvider extends Provider {
    constructor() {
        super("ProviderName", "https://provider-url.com/");
    }
    
    async fetchMangaList(): Promise<Manga[]> {
        // Implementation
    }
    
    async getChapters(manga: Manga): Promise<Chapter[]> {
        // Implementation
    }
    
    async getPages(chapter: Chapter): Promise<string[]> {
        // Implementation
    }
    
    async search(title: string, limitManga?: number): Promise<Manga[] | undefined> {
        // Implementation
    }
    
    async grabManga(url: string): Promise<Manga | undefined> {
        // Implementation
    }
    
    async getTrending(): Promise<Manga[]> {
        // Implementation
    }
}
```

Then add it to the `providers` object in the `Komikku` class.

## License

MIT