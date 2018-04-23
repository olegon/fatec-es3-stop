const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Account = mongoose.model('Account');

router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/backoffice');
    }
    else {
        res.render('backoffice/login', { 
            title: 'Login',
            flashMessage: req.flash('login-error')
        });
    }

    
});

router.post('/', async (req, res, done) => {
    const { username, password } = req.body;

    const user = await Account.findOne({ username });

    if (user == null) {
        req.flash('login-error', 'Usuário não encontrado');
        res.redirect('/backoffice/login');
        return done();
    }

    if (user.password != password) {
        req.flash('login-error', 'Senha inválida');
        res.redirect('/backoffice/login');
        return done();
    }

    req.session.user = user;
    res.redirect('/backoffice');

    done();
});

module.exports = router;