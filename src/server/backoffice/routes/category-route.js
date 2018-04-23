const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('backoffice/category', { 
        title: 'Categorias'
    });
});

module.exports = router;