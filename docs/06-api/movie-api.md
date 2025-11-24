# Movie API (TMDB)

Integration with The Movie Database (TMDB) API for movie data.

---

## Overview

**API Provider:** The Movie Database (TMDB)
**Base URL:** `https://api.themoviedb.org/3`
**Documentation:** https://developers.themoviedb.org/3

---

## Configuration

Location: `/services/api.ts`

```typescript
const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
  }
}
```

---

## Authentication

### API Key Setup

**Environment Variable:** `EXPO_PUBLIC_MOVIE_API_KEY`

**Format:** Bearer token (JWT from TMDB)

**Example:**
```
eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MjQ4NmVlNWU5MzA5ZGViZDg2ZTMxMzVjYzMyMmI4MSIsIm5iZiI6MTc2MzE0MDk2NS4xNzQsInN1YiI6IjY5MTc2NTY1Mjk1ZjMzZWI5NWFjMmExZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fS-kQoRy_UFWJcLQV8pcApTH308zVuYM8yFi59oV-dQ
```

**Where to get:**
1. Sign up at https://www.themoviedb.org/
2. Go to Settings → API
3. Request API key
4. Copy the "API Read Access Token" (Bearer token)

---

## Endpoints Used

### 1. Search Movies

**Endpoint:** `/search/movie`

**Purpose:** Search for movies by title

```typescript
const endpoint = `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
```

**Parameters:**
- `query` (required): Search term

**Example Request:**
```
GET https://api.themoviedb.org/3/search/movie?query=inception
```

**Response:**
```json
{
  "results": [
    {
      "id": 27205,
      "title": "Inception",
      "overview": "Cobb, a skilled thief...",
      "poster_path": "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      "backdrop_path": "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      "vote_average": 8.4,
      "release_date": "2010-07-16"
    }
  ]
}
```

---

### 2. Discover Movies (Popular)

**Endpoint:** `/discover/movie`

**Purpose:** Get list of popular movies

```typescript
const endpoint = `${BASE_URL}/discover/movie?sort_by=popularity.desc`
```

**Parameters:**
- `sort_by=popularity.desc`: Sort by most popular

**Example Request:**
```
GET https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc
```

**Response:** Same format as search results

---

## Usage in App

### Function: `fetchMovies()`

Location: `/services/api.ts`

```typescript
export const fetchMovies = async ({ query }: { query: string }) => {
  // Choose endpoint based on query
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  // Make request with bearer token
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: TMDB_CONFIG.headers
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
}
```

**Usage in components:**

```typescript
// Search tab - with query
const { data: movies } = useFetch(() => fetchMovies({ query: searchQuery }))

// Saved tab - popular movies
const { data: movies } = useFetch(() => fetchMovies({ query: '' }))
```

---

## Response Data Structure

### Movie Object

```typescript
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;      // Path to poster image
  backdrop_path: string | null;    // Path to backdrop image
  vote_average: number;             // Rating (0-10)
  release_date: string;             // YYYY-MM-DD format
  genre_ids: number[];
  popularity: number;
}
```

---

## Image URLs

TMDB returns image paths, not full URLs. You need to construct them:

**Base URL:** `https://image.tmdb.org/t/p/`

**Sizes:**
- Poster: `w342` (small), `w500` (medium), `w780` (large)
- Backdrop: `w780`, `w1280`, `original`

**Full URL Construction:**
```typescript
const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
```

**Example:**
```
https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg
```

---

## Error Handling

```typescript
if (!response.ok) {
  const errorText = await response.text();
  console.log('Error response:', errorText);
  throw new Error(`Failed to fetch movies: ${response.statusText}`);
}
```

**Common Errors:**
- **401 Unauthorized**: Invalid or expired API key
- **404 Not Found**: Invalid endpoint
- **429 Too Many Requests**: Rate limit exceeded

---

## Rate Limits

TMDB API limits:
- **Free tier**: 40 requests per 10 seconds
- **No daily limit** for free tier

**Current usage:** Low (only used in Search and Saved tabs)

---

## Environment Variables

**File:** `.env` (create if doesn't exist)

```bash
EXPO_PUBLIC_MOVIE_API_KEY=your_bearer_token_here
```

**Access in code:**
```typescript
process.env.EXPO_PUBLIC_MOVIE_API_KEY
```

**Note:** `EXPO_PUBLIC_` prefix makes it available in the app (client-side)

---

## Where Used in App

### Search Tab (`/app/(tabs)/search.tsx`)
- User types query
- Debounced search (500ms delay)
- Calls `fetchMovies({ query: searchQuery })`
- Displays results in 3-column grid

### Saved Tab (`/app/(tabs)/saved.tsx`)
- Displays popular movies on mount
- Calls `fetchMovies({ query: '' })`
- Same 3-column grid display

### Movie Card Component (`/components/MovieCard.tsx`)
- Displays movie poster
- Shows title and rating
- Links to movie detail page

---

## Future Enhancements

- 💡 Cache movie results to reduce API calls
- 💡 Add movie details page with full info
- 💡 Add genre filtering
- 💡 Add "Now Playing", "Top Rated" categories
- 💡 Add movie trailers (TMDB provides video keys)
- 💡 Implement pagination for search results

---

## Testing

**Test endpoints directly:**

```bash
curl -X GET "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "accept: application/json"
```

**Check API status:**
https://status.themoviedb.org/

---

## Security Notes

- ✅ API key stored in environment variables
- ✅ Using Bearer token (more secure than API key)
- ⚠️ Token is exposed client-side (acceptable for TMDB read-only access)
- 💡 Consider using TMDB's user authentication for write operations

---

## Additional Resources

- **TMDB API Docs**: https://developers.themoviedb.org/3
- **API Reference**: https://developers.themoviedb.org/3/getting-started/introduction
- **Image Guidelines**: https://developers.themoviedb.org/3/getting-started/images
