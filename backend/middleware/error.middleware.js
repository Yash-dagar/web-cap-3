// runs when no route matched
const notFound = (req, res, next) => {
    res.status(404).json({ success: false, message: 'Not found - ' + req.originalUrl });
};

// every controller sends its errors here using next(error)
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong on the server';

    if (err.name === 'ValidationError') {
        // mongoose schema validation failed
        statusCode = 400;
        message = Object.values(err.errors).map((item) => item.message).join(', ');
    } else if (err.name === 'CastError') {
        // wrong id format
        statusCode = 400;
        message = 'Invalid ' + err.path + ': ' + err.value;
    } else if (err.code === 11000) {
        // unique index error
        statusCode = 409;
        if (err.keyValue && err.keyValue.email) {
            message = 'This email is already registered';
        } else {
            message = 'This record already exists';
        }
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired, please login again';
    } else {
        console.log(err);
    }

    res.status(statusCode).json({ success: false, message: message });
};

module.exports = { notFound, errorHandler };
