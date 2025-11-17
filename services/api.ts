const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}

//console.log('API KEY:', process.env.EXPO_PUBLIC_MOVIE_API_KEY);  // Add this line

export const fetchMovies = async ({ query }: { query: string }) => {
    const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}` //fetch movies based on search query
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`; //fetch popular movies if no search query

    //console.log('Fetching from:', endpoint);
    //console.log('Headers:', TMDB_CONFIG.headers);

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers
    })

    //console.log('Response status:', response.status);
    //console.log('Response ok:', response.ok);

    if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
}



/* const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MjQ4NmVlNWU5MzA5ZGViZDg2ZTMxMzVjYzMyMmI4MSIsIm5iZiI6MTc2MzE0MDk2NS4xNzQsInN1YiI6IjY5MTc2NTY1Mjk1ZjMzZWI5NWFjMmExZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fS-kQoRy_UFWJcLQV8pcApTH308zVuYM8yFi59oV-dQ'
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err)); */