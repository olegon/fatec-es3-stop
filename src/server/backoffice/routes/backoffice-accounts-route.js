const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('backoffice/backoffice-accounts', { 
        title: 'Administradores'
    });
});

module.exports = router;