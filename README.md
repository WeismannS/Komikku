## Overview

Komikku is a TypeScript-based manga scraper library that provides a unified API for fetching manga data from various sources. It currently supports DemonicScans as a provider, with an extensible architecture to add more providers.

## Installation

the only dependancy Komikku depends on is [@jsr/dom-deno](https://jsr.io/@b-fuze/deno-dom), simply :
```bash
# for bun :
        bun install
# for node :
        npm install
# for deno :
        deno install
```
if you encounter an error, please explicitly install the package and it should work
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
const komikku = new Komikku();

// Search across all providers
const results = await komikku.search("One Piece");

// Search with specific providers and limit
const limitedResults = await komikku.search("Naruto", {
  providers: ["Demonicscans"],
  limitManga: 5
});
```

## Core Components

### `Komikku`

The main client class that handles providers and provides a unified search interface.

### `Provider`

Abstract base class that all manga providers must implement:

- `fetchMangaList()`: Fetches the complete manga list
- `getChapters(manga)`: Gets chapters for a specific manga
- `getPages(chapter)`: Gets page images for a specific chapter
- `search(title, limitManga?)`: Searches for manga by title
- `grabManga(url)`: Fetches detailed manga information
- `getTrending()`: Gets trending manga

### `DemonicProvider`

Implementation of the Provider interface for DemonicScans.

### Data Models

#### `Manga`

Represents a manga with properties like title, authors, chapters, etc.

#### `Chapter`

Represents a manga chapter with methods to fetch and manage pages.

## Utilities

### `anilist.ts`

Provides functionality to fetch manga metadata from AniList GraphQL API:

- `tryFetch()`: Helper function for making HTTP requests with retry logic
- `anilistFetch()`: Fetches manga metadata from AniList

## Development

The project uses TypeScript with Bun as the runtime. The configuration is set up in tsconfig.json.

### Project Structure

```
scraper/
├── index.ts          # Entry point
├── lib.ts            # Main library class
├── models/           # Provider implementations
│   ├── DemonicProvider.ts
│   └── Provider.ts
└── utils/            # Utility functions and interfaces
    ├── anilist.ts
    ├── interface.ts
    └── types.ts
```

### Adding a New Provider

To add a new provider, create a new class that extends `Provider` and implements all required abstract methods. Then add it to the `providers` object in `Komikku`.