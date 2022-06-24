const express = require('express');
const router = express.Router();

const { playCasinoGame } = require('../controllers/casino');
const { saveAnalytics } = require('../controllers/analytics');

const { retrieveWallet, requiredWallet } = require('../middleware/wallet');

router.post('/:casino/:game/:gameVersion', requiredWallet, retrieveWallet, playCasinoGame);

router.post('/analytics', saveAnalytics);

module.exports = router
