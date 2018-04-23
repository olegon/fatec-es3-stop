const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

module.exports = function(app, server) {
    // Carrega models
    const models = require('./models');

    // Carrega models
    const indexRoute = require('./routes/index-route');

    const apiRouter = express.Router();

    apiRouter.use(bodyParser.json());
    apiRouter.use(bodyParser.urlencoded({ extended: false }));

    apiRouter.use('/words', require('./routes/word-route'));
    apiRouter.use('/category', require('./routes/category-route'));
    apiRouter.use('/game-parameters', require('./routes/game-parameters-route'));

    app.use('/api', apiRouter);
}