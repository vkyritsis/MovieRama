const { ErrorHandler } = require('../helpers/error-handler');
const { Cached } = require('../helpers/cache');
const { Services } = require('../components/services');

class Templates {
    constructor() {
        this.service = new Services();
        this.errorHandler = new ErrorHandler();
        this.cached = new Cached();
    }

    createList(movies, listContainer) {
        let noResults = document.getElementById('no-results');
        if (listContainer && movies && movies.results.length > 0) {
            noResults.classList.add('hidden');
            movies.results.forEach(movie => {
                let dom = document.createElement('div');
                dom.classList.add("grid-item");
                dom.innerHTML = this.createItemList(movie);
                listContainer.appendChild(dom);
                let movieItem = document.querySelector(`div[data-id="${movie.id}"]`);
                movieItem.addEventListener('click', () => this.fetchDetails(movie.id))
            });
        } else {
            noResults.classList.remove('hidden');
        }
    }

    createItemList(movie) {
        const imageUrl = "https://image.tmdb.org/t/p/w185_and_h278_bestv2/";
        const imagePath = (movie.poster_path)?`${imageUrl}${movie.poster_path}`:(movie.backdrop_path)?`${imageUrl}${movie.poster_path}${movie.backdrop_path}`:"";
        return `
            <div class="grid-container movie-item" id="${movie.id}">
                <div class="grid-item poster">
                   ${imagePath==""?"Poster Not Available":'<img src=' + imagePath + '>'}
                </div>
                <div class="grid-item main">
                <div>
                    <h3 class="title">${movie.title} <span class="date-released">(${(movie.release_date)?new Date(movie.release_date).getFullYear():"Not Available"})</span></h3>
                    <h5 class="genre">${this.cached.getGenres(movie.genre_ids)}</h5>
                </div>
                <div >
                    ${movie.overview}
                </div>
                    <div class="moreInfo" data-id="${movie.id}"> Click for details </div>
                </div>
                <div class="grid-item footer">
                    <div class="rating ${(movie.vote_average < 5) ? 'red' : 'green'}"> ${movie.vote_average}</div>
                </div>
            </div>
        `;
    }

    async fetchDetails(movieId) {
        let movieDetailsCalls = [
            this.service.getMovieDetails(movieId),
            this.service.getMovieVideos(movieId),
            this.service.getMovieReviews(movieId),
            this.service.getMovieSimilars(movieId)
        ];

        await Promise.all(movieDetailsCalls).then(results => {
            const movieDetailsExist = details => details.className == "grid-item movie-details";
            let hasDetails = false;
            let details = document.getElementById(movieId);

            details.parentNode.childNodes.forEach(node => {
                if (movieDetailsExist(node)) {
                    details.parentNode.removeChild(node);
                    hasDetails = true;
                }
            });

            if (!hasDetails) {
                let dom = document.createElement('div');
                dom.classList.add("grid-item");
                dom.classList.add("movie-details");
                dom.innerHTML = this.drawDetails(results);
                details.parentNode.appendChild(dom);
            }
        }).catch(err => this.errorHandler.httpErrorHandler(err));
    }

    drawDetails(movieDetails) {
        if(movieDetails.length == 0){
            return `No More Details.`
        }

            let details = movieDetails[0];
            let trailer = (movieDetails[1].results) ? movieDetails[1].results.find(v => v.type == 'Trailer') : null;
            let reviews = movieDetails[2].results;
            let reviewsArea = "";
            let similarMovies = movieDetails[3].results;
            let similarMoviesArea = "";
            let movieItem = document.getElementById(details.id);

            if (reviews.length > 0) {
                reviews.slice(0, 2).forEach(review => reviewsArea += `
                    <h5 class="author"> ${review.author} </h5>
                        ${review.content}
                    `);
            } else {
                reviewsArea = 'There are no reviews yet.'
            }

            if (similarMovies.length > 0) {
                similarMovies.forEach(similarMovie => similarMoviesArea += `  
                <div class="card">
                <div class="grid-item poster">
                <img src='https://image.tmdb.org/t/p/w138_and_h175_bestv2/${similarMovie.poster_path}' alt='${similarMovie.backdrop_path}'>
                </div>
                </div>`);
            } else {
                similarMoviesArea = "There aren't any similar movies."
            }

            return `
            <div class="grid-container-details">
            <div class="grid-item similar-movies"  >
            <h5>Similar Movies</h5>
                <div class="scrolling-wrapper-flexbox " style="width:${movieItem.getBoundingClientRect().width - 40}px">
                ${similarMoviesArea}
                </div>
            </div>
            <div class="grid-item reviews">
                <h5> Reviews </h5>
                ${reviewsArea}
            </div>
            
            <div class="grid-item">
                <h5>${(trailer) ? trailer.name : ""}</h5>
                <div class = "trailer-area">
                        <iframe allowfullscreen frameborder="0"  class="video"
                            src=${(trailer) ? "http://www.youtube.com/embed/" + trailer.key : '""'}
                        </iframe>
                        </div>
                </div>
            </div>
            `;
    }
}

module.exports.Templates = Templates;