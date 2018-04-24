const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('backoffice/game-parameters', { 
        title: 'Parâmetros do Jogo'
    });
});

module.exports = router;