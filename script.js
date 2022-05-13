// Global Constants
const apiBaseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p'
const apiKey = '34386ec5358ca437ec6fd6b684886f4d';

// Global Variables
var currentApiPage = 1;

// Page Elements
const moviesSection = document.getElementById('movies-grid');
const nowPlayingMoviesList = document.getElementById('now-playing-movies-list');
const loadMoreBtn = document.getElementById('load-more-movies-btn');

async function fetchMoviesNowPlaying() {
    const response = await fetch(`${apiBaseUrl}/movie/now_playing?api_key=${apiKey}&page=${currentApiPage}`);
    const jsonResponse = await response.json();

    let movies = jsonResponse.results.map(result => ({
        id: result.id,
        title: result.title,
        posterPath: result.poster_path,
        voteAverage: result.vote_average,
    }))

    displayMovies(movies, nowPlayingMoviesList);
    loadMoreBtn.disabled = false;
}

function displayMovies(movies, htmlElement) {
    const moviesHTMLString = movies.map(movie => `
        <li class="movie-card">
            <img class="movie-poster" src="${imageBaseUrl}/w342${movie.posterPath}" alt="${movie.title}" title="${movie.title}"/>
            <div class="movie-details">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-votes">⭐ ${movie.voteAverage}</div>
            </div>
        </li>
    `).join('');

    htmlElement.innerHTML = htmlElement.innerHTML + moviesHTMLString;
}

function init() {
    fetchMoviesNowPlaying();
}

init();
