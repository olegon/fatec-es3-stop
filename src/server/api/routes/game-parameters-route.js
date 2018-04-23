const express = require('express');

const controller = require('../controllers/game-parameters-controller');

const router = express.Router();

router.get('/', controller.get);
router.put('/', controller.put);

module.exports = router;