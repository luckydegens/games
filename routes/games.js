const express = require('express');
const router = express.Router();

const { getSlotMachineResult } = require('../controllers/games');

router.post('/decentraland/slot1', getSlotMachineResult);

module.exports = router
