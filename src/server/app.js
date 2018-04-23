const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Conecta ao banco
mongoose.connect('mongodb://nodestop:nodestop@ds153869.mlab.com:53869/nodestop');

// Carrega models
const Word = require("./models/word");

// Carrega rotas
const indexRoute = require('./routes/index-route');
const wordRoute = require('./routes/word-route');
const categoryRoute = require('./routes/category-route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRoute);
app.use('/words', wordRoute);
app.use('/category', categoryRoute);

module.exports = app;