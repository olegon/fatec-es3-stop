const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const BackofficeAccount = mongoose.model('BackofficeAccount');
const BackofficeAccountService = require('../../services/backoffice-account-service')(BackofficeAccount);

router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/backoffice');
    }
    else {
        res.render('backoffice/login', { 
            title: 'Login',
            flashMessage: req.flash('login-error'),
            notAuthenticated: true
        });
    }
});

router.post('/', async (req, res, done) => {
    try {
        const { username, password } = req.body;

        const account = await BackofficeAccountService.getAccountByUsernameAndPassword(username, password);

        if (account == null) {
            req.flash('login-error', 'Usuário ou senha inválidos.');
            res.redirect('/backoffice/login');
        }
        else {
            req.session.user = account;
            res.redirect('/backoffice');
        
        }

        done();
    }
    catch (err) {
        console.error(err);

        req.flash('login-error', 'Serviço indisponível.');
        res.redirect('/backoffice/login');
    }
});

module.exports = router;