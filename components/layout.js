const { Templates } = require('../components/templates');
const { Services } = require('../components/services');

let PAGE_COUNT = 1;
let PREV_PAGE = 0;
let stringQuery = "";
let listContainer = "";

class Layout {

    constructor() {
        this.service = new Services();
        this.template = new Templates();
        document.addEventListener("DOMContentLoaded", () => {
            let search = document.getElementById('search');
            let allMoviesBtn = document.getElementById('resetBtn');
            listContainer = document.getElementById('movierama-list-container');
            search.addEventListener('keyup', (e) => {
                this.performSearch(e.target.value);
            });

            allMoviesBtn.addEventListener('click', () => {
                this.performSearch();
            });
        });

        document.addEventListener('scroll', (e) => {
            this.infiniteScroll(stringQuery);
        });
    }

    performSearch(query = "",genres) {
        PREV_PAGE = 0;
        if (query.length > 0) {
            stringQuery = query;
            PAGE_COUNT = 1;
            this.service.searchForMovies(query, PAGE_COUNT).then(movies => {
                listContainer.innerHTML = "";
                PAGE_COUNT = movies.page;
                this.template.createList(movies, listContainer);
                window.scrollTo(0, 0);
            });
        } else if (query.length == 0) {
            stringQuery = "";
            this.service.getNowPlaying(1).then(movies => {
                listContainer.innerHTML = "";
                query = "";
                PAGE_COUNT = movies.page;
                this.template.createList(movies, listContainer);
                window.scrollTo(0, 0);
            });
        }
    }

    async infiniteScroll(query) {
        let scrollPos = 0;

        if((document.body.getBoundingClientRect()).top > scrollPos){
            return;
        }   

        let bottom = document.documentElement.getBoundingClientRect().bottom;

        if (bottom < document.documentElement.clientHeight + 500) {
            let thisMovies = null;
            if (PREV_PAGE != PAGE_COUNT) {
                if (query == "") {
                    PREV_PAGE = PAGE_COUNT;
                    await this.service.getNowPlaying(PAGE_COUNT + 1).then(movies => {
                        if (movies.results && movies.results.length > 0) {
                            PAGE_COUNT = movies.page;
                            thisMovies = movies;
                        }
                    });
                } else {
                    PREV_PAGE = PAGE_COUNT;
                    await this.service.searchForMovies(query, PAGE_COUNT + 1).then(movies => {
                        if (movies.results && movies.results.length > 0) {
                            PAGE_COUNT = movies.page;
                            thisMovies = movies;
                        }
                    });
                }
                this.template.createList(thisMovies, listContainer);
            }
        }

        scrollPos = (document.body.getBoundingClientRect()).top;
    }
}

module.exports.Layout = Layout;