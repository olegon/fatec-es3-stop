'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/word-controller');

router.get('/', controller.get);
router.post('/', controller.post);
router.put('/:id', controller.put);
router.delete('/', controller.delete);

module.exports = router;