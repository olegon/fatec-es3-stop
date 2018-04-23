const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('backoffice/word', { 
        title: 'Palavras'
    });
});

module.exports = router;