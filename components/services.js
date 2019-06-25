const { ErrorHandler } = require('../helpers/error-handler');

const API_KEY = 'bc50218d91157b1ba4f142ef7baaa6a0';
const BASE_URL= 'https://api.themoviedb.org/3/';

const GET = {
    GENRES : 'genre/movie/list',
    NOW_PLAYING : 'movie/now_playing',
    SEARCH  : 'search/movie',
    DETAILS : (id) => `movie/${id}`,
    VIDEOS : (id) => `movie/${id}/videos`,
    REVIEWS : (id) => `movie/${id}/reviews`,
    SIMILAR : (id) => `movie/${id}/similar`
};

const params = {
    api_key:API_KEY,
    language:'en-US'
};

class Services {

    constructor() { 
        this.errorHandler = new ErrorHandler();
    }

    async getGenres() {
        const url = this.getQueryString(`${BASE_URL}${GET.GENRES}`, params);
        return await fetch(url, {
            method: 'GET'
        }).
            then(res => res.json()).catch(err => this.errorHandler.httpErrorHandler(err));
    }

    async getNowPlaying(page) {
        params.page = page;
        const url = this.getQueryString(`${BASE_URL}${GET.NOW_PLAYING}`, params);
        return await fetch(url, {
            method: 'GET'
        }).
            then(res => {
                return res.json();
            }).catch(err => this.errorHandler.httpErrorHandler(err));
    }

    async searchForMovies(query, page) {
        params.page=page;
        params.query = query;
        const url = this.getQueryString(`${BASE_URL}${GET.SEARCH}`, params);

        return await fetch(url, {
            method: 'GET'
        }).
            then(res => res.json()).catch(err => this.errorHandler.httpErrorHandler(err));
    }

    async getMovieDetails(movieId) {
        const url = this.getQueryString(`${BASE_URL}${GET.DETAILS(movieId)}`, params);

        return await fetch(url, {
            method: 'GET'
        }).
            then(res => res.json()).catch(err => this.errorHandler.httpErrorHandler(err));
    }

    async getMovieVideos(movieId) {
       
        const url = this.getQueryString(`${BASE_URL}${GET.VIDEOS(movieId)}`, params);
        return await fetch(url, {
            method: 'GET'
        }).
            then(res => res.json()).catch(err => this.errorHandler.httpErrorHandler(err));
    }

    async getMovieReviews(movieId) {
        const url = this.getQueryString(`${BASE_URL}${GET.REVIEWS(movieId)}`, params);
        return await fetch(url, {
            method: 'GET'
        }).
            then(res => res.json()).catch(err => this.errorHandler.httpErrorHandler(err));
    }

    async getMovieSimilars(movieId) {
        const url = this.getQueryString(`${BASE_URL}${GET.SIMILAR(movieId)}`, params);
        return await fetch(url, {
            method: 'GET'
        }).
            then(res => res.json()).catch(err => this.errorHandler.httpErrorHandler(err));
    }

    getQueryString (url,params) {
        const endPointUrl = new URL(url);
        Object.keys(params).forEach(key => endPointUrl.searchParams.append(key, params[key]));
        return endPointUrl;
    }
}

module.exports.Services = Services;