const Promise = require('bluebird')

class ErrorHandler {
    httpErrorHandler(err) {
        return Promise.reject(err)
            .catch((err) => {
                alert(err);
            });
    }
}

module.exports.ErrorHandler = ErrorHandler;