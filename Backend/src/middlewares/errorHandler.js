function NewErrorHandler(error, req, res, next) {
    res.status(error.status || 500);
    res.send({'message': error.message || ':) Internal server error'})
};

module.exports = NewErrorHandler;
