const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const morgan = require('morgan');


module.exports = function (app, server) {
    const backofficeRouter = express.Router();

    backofficeRouter.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'));

    backofficeRouter.use('/public', express.static(path.join(__dirname, 'public'))); 
    
    backofficeRouter.use(flash());
    backofficeRouter.use(bodyParser.json());
    backofficeRouter.use(bodyParser.urlencoded({ extended: false }));
    backofficeRouter.use(session({
        secret: 'SESSION-SECRET',
        resave: false,
        saveUninitialized: false
    }));

    backofficeRouter.get('/', (req, res) => {
        if (req.session.user == null) {
            res.redirect('/backoffice/login');
        }
        else {
            res.render('backoffice/index', { title: 'Backoffice' });
        }
    });

    backofficeRouter.use('/login', require('./routes/login-route'));
    backofficeRouter.get('/logout', (req, res) => {
        delete req.session.user;
        res.redirect('/backoffice');
    });

    backofficeRouter.use((req, res, next) => {
        if (req.session.user == null) {
            res.redirect('/backoffice/login');
        }
        else {
            next();
        }
    });
    
    backofficeRouter.use('/categories', require('./routes/categories-route'));
    backofficeRouter.use('/words', require('./routes/words-route'));
    backofficeRouter.use('/game-parameters', require('./routes/game-parameters-route'));
    backofficeRouter.use('/backoffice-accounts', require('./routes/backoffice-accounts-route'));

    app.use('/backoffice', backofficeRouter);
};