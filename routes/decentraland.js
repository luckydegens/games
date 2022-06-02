const express = require('express');
const router = express.Router();

const getSlot1MachineResult = require('../controllers/slot/slot1');
const { saveAnalytics } = require('../controllers/analytics');

const { retrieveWallet } = require('../middleware/wallet');

router.post('/slot1', retrieveWallet, getSlot1MachineResult);

router.post('/analytics', saveAnalytics);

module.exports = router
