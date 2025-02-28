
//error handler middleware
const errorHandler = (err, req, res, next) => {
    //check if response headers have already been sent to client
    if (res.headersSent) {
        return next(err);
    }

    //set the status code of the response
    const statusCode = err.statusCode && res.statusCode >= 400 ? res.statusCode : 500;
    res.status(statusCode); //set status code of response

    //log error stack trace to console if not in production
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });

};

export default errorHandler;