A Type-Safe TypeScript-based Interface library that provides a unified API for fetching manga/manhwa data from various sources.

## Features

- 🌐 **Unified API**: Access manga from multiple sources with a consistent interface
- 🔍 **Search**: Find manga across different providers
- 📊 **Trending**: Get currently trending manga
- 📖 **Chapter Management**: Fetch chapters and page images
- 📱 **Integration**: AniList integration for enhanced metadata
- 🛠️ **Extensible**: Architecture designed for easy addition of new providers
- 🧩 **Type-Safe**: Full TypeScript support with comprehensive type definitions
- ⚡ **Cross-Runtime**: Works with Node.js, Bun, and Deno

## Installation

```bash
# For Bun:
bun install komikku

# For Node:
npm install komikku

# For Deno:
import { Komikku } from "https://deno.land/x/komikku/src/index.ts";
```

## Usage

### Basic Usage

```typescript
import { Komikku } from "komikku";

// Initialize the Komikku client
const komikku = new Komikku();

// Get trending manga from DemonicScans
const trendingManga = await komikku.providers.Demonicscans.getTrending();
```

### Search for Manga

```typescript
// Search across all providers
const {data: results} = await komikku.search("One Piece");

// Search with specific providers and limit
const {data: limitedResults} = await komikku.search("Naruto", {
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
const {data: manga} = await komikku.search("One Piece", { limitManga: 1 });
const chapters = await manga[0].getChapters();
const firstChapter = chapters[0];

// Get the pages for a chapter
const pages = await firstChapter.getPages();
```

### AniList Integration

```typescript
import { Komikku } from "komikku";

const komikku = new Komikku();

// Search for manga using AniList
const {data: searchResults} = await komikku.Anilist.search({
  search: "One Piece", 
  type: "MANGA",
  perPage: 5
});
```

## Error Handling

Komikku provides robust error handling with detailed error types:

```typescript
const {data: results, error} = await komikku.search("One Piece");

if (error) {
  console.error(`Error: ${error.message} (Code: ${error.code})`);
} else {
  console.log(`Found ${results.length} results`);
}
```

## Architecture

### Core Components

- **`Komikku`**: Main client class that handles providers and provides a unified search interface.
- **`Provider`**: Abstract base class that all manga providers must implement.
- **`DemonicProvider`**: Implementation of the Provider interface for DemonicScans.

### Data Models

- **`Manga`**: Represents a manga with properties like title, authors, chapters, etc.
- **`Chapter`**: Represents a manga chapter with methods to fetch and manage pages.

### Utilities

- **`Anilist`**: Fetch manga metadata from AniList GraphQL API.
- **`Helper`**: Utility functions for HTTP requests with retry logic.

## Currently Supported Providers

- DemonicScans

## Adding a New Provider

To add a new provider, create a new class that extends `Provider` and implements all required abstract methods:

```typescript
import { Provider } from "./models/Provider.ts";
import { Manga } from "./types/interface.ts";
import { Chapter } from "./types/types.ts";
import { Result } from "./types/Exceptions.ts";

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
    
    async search(title: string, limitManga?: number): Promise<Result<Manga[]>> {
        // Implementation
    }
    
    async grabManga(url: string): Promise<Result<Manga>> {
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