const express = require('express');
const router = express.Router();

const { playCasinoGame } = require('../controllers/casino');
const { saveAnalytics } = require('../controllers/analytics');

const { retrieveWallet } = require('../middleware/wallet');

router.post('/:casino/:game/:gameVersion', retrieveWallet, playCasinoGame);

router.post('/analytics', saveAnalytics);

module.exports = router
