const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const morgan = require('morgan');
const models = require('./models');


module.exports = function (app, server) {
    const backofficeRouter = express.Router();

    backofficeRouter.use(morgan('dev'));

    backofficeRouter.use('/public', express.static(path.join(__dirname, 'public'))); 
    
    backofficeRouter.use(flash());
    backofficeRouter.use(bodyParser.json());
    backofficeRouter.use(bodyParser.urlencoded());
    backofficeRouter.use(session({
        secret: 'SESSION-SECRET',
        resave: false,
        saveUninitialized: false
    }));

   

    backofficeRouter.get('/', (req, res) => {
        if (req.session.user == null) {
            res.render('backoffice/login');
        }
        else {
            res.render('backoffice/index');
        }
    });

    backofficeRouter.use('/login', require('./routes/login-route'));


    backofficeRouter.use((req, res, done) => {
        if (req.session.user == null) {
            res.redirect('/backoffice/login');
        }
        else {
            done();
        }
    });

    backofficeRouter.use('/login', require('./routes/login-route'));
    backofficeRouter.use('/category', require('./routes/category-route'));
    backofficeRouter.use('/word', require('./routes/word-route'));

    app.use('/backoffice', backofficeRouter);
};