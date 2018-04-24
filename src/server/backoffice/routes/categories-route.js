const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('backoffice/categories', { 
        title: 'Categorias'
    });
});

module.exports = router;