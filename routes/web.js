const express = require('express');
const router = express.Router();

const { playWebGame } = require('../controllers/web');

const { retrieveWallet } = require('../middleware/wallet');

router.post('/:game/:gameVersion', retrieveWallet, playWebGame);

module.exports = router
