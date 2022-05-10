const express = require('express');
const router = express.Router();

const { getSlotMachineResult, saveAnalytics } = require('../controllers/decentraland');

router.post('/slot1', getSlotMachineResult);

router.post('/analytics', saveAnalytics);

module.exports = router
