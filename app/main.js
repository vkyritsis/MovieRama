const { Services } = require('../components/services');
const { ErrorHandler } = require('../helpers/error-handler');
const { Layout } = require('../components/layout');

let launchApplication = () => {
    const services = new Services();
    const layout = new Layout();
    const errorHandler = new ErrorHandler();
    services.getGenres().then(result=>{
        localStorage.setItem('GENRES', JSON.stringify(result.genres));
        layout.performSearch();
    });
}

launchApplication();