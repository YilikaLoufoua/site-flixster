const apiBaseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p'
const apiKey = '34386ec5358ca437ec6fd6b684886f4d';

var currentApiPage = 1;

const moviesSection = document.getElementById('movies-grid');
const nowPlayingMoviesList = document.getElementById('now-playing-movies-list');
const loadMoreBtn = document.getElementById('load-more-movies-btn');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const closeSearchBtn = document.getElementById('close-search-btn');
const searchSection = document.getElementById('search-section');
const moviesSearchResults = document.getElementById('movie-search-results');

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
    loadMoreBtn.classList.remove('hidden');
}

function displayMovies(movies, htmlElement) {
    const moviesHTMLString = movies.map(movie => `
        <li class="movie-card" onclick="selectMovie(${movie.id})" >
            <img class="movie-poster" src="${imageBaseUrl}/w342${movie.posterPath}" alt="${movie.title}" title="${movie.title}"/>
            <div class="movie-details">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-votes">⭐ ${movie.voteAverage}</div>
            </div>
        </li>
    `).join('');

    htmlElement.innerHTML = htmlElement.innerHTML + moviesHTMLString;
}

async function searchMovies(searchQuery) {
    const response = await fetch(`${apiBaseUrl}/search/movie?api_key=${apiKey}&query=${searchQuery}`);
    const jsonResponse = await response.json();

    let movies = jsonResponse.results.map(result => ({
        id: result.id,
        title: result.title,
        posterPath: result.poster_path,
        voteAverage: result.vote_average,
    }))

    return movies;
}

async function selectMovie(id) {
    var response = await fetch(`${apiBaseUrl}/movie/${id}?api_key=${apiKey}`);
    var jsonResponse = await response.json();

    const movie = {
        id: id,
        title: jsonResponse.title,
        overview: jsonResponse.overview,
        posterPath: jsonResponse.poster_path,
        backdropPath: jsonResponse.backdrop_path,
        releaseDate: jsonResponse.release_date,
        status: jsonResponse.status,
        runtime: jsonResponse.runtime,
        genres: jsonResponse.genres,
        voteAvg: jsonResponse.vote_average,
    }
    
    // fetch movie trailer
    response = await fetch(`${apiBaseUrl}/movie/${id}/videos?api_key=${apiKey}`);
    jsonResponse = await response.json();
    movie.trailerPath = jsonResponse.results[0].key;

    displayMoviePopup(movie);
}

function displayMoviePopup(movie) {
    const popup = document.createElement('div');
    popup.className = 'popup';

    const genres = movie.genres.slice(0, 3).map(genre => genre.name).join(', ');

    popup.innerHTML = `
        <button id="close-btn" onclick="closePopup()">Close</button>
        <article class="movie-popup">
            <img class="movie-backdrop" src="${imageBaseUrl}/w780${movie.backdropPath}" alt="${movie.title}" title="${movie.title}"/>
            <section class="movie-details">
                <div class="movie-image">
                    <img class="movie-poster" src="${imageBaseUrl}/w342${movie.posterPath}" alt="${movie.title}" title="${movie.title}"/>
                </div>
                <div class="movie-info">
                    <p class="movie-genres">${genres}</p>
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-specs">${movie.runtime} min | ${movie.releaseDate}</p>
                </div>
                <div class="movie-votes">
                    <span>⭐${movie.voteAvg}</span>
                </div>
            </section>
            <p class="movie-overview">${movie.overview}</p>
            <iframe id="ytplayer" type="text/html" width="100%" height="340px" src="https://www.youtube.com/embed/${movie.trailerPath}"></iframe>
        </article>
    `;

    document.body.appendChild(popup)
    document.body.style.height = '100vh';
    document.body.style.overflowY = 'hidden';
}

function closePopup() {
    const popup = document.querySelector('.popup');
    popup.parentElement.removeChild(popup);

    document.body.style.height = '';
    document.body.style.overflowY = '';
}

async function handleSearchFormSubmit(event) {
    event.preventDefault();

    const searchQuery = searchInput.value;

    if (searchQuery.trim().length) {
        moviesSearchResults.innerHTML = '';
        const searchResults = await searchMovies(searchQuery);
        displayMovies(searchResults, moviesSearchResults);
    }

    moviesSection.classList.add('hidden');
    searchSection.classList.remove('hidden');
    closeSearchBtn.classList.remove('hidden');
}

function closeSearch() {
    moviesSection.classList.remove('hidden');
    searchSection.classList.add('hidden');
    closeSearchBtn.classList.add('hidden');
    moviesSearchResults.innerHTML = '';
    searchInput.value = '';
}

function loadMoreMovies() {
    currentApiPage++;
    fetchMoviesNowPlaying();
}

function init() {
    searchForm.addEventListener('submit', handleSearchFormSubmit);
    fetchMoviesNowPlaying();
}

init();
