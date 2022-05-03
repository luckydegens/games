const express = require('express');
const router = express.Router();

const { getSlotMachineResult } = require('../controllers/decentraland');

router.post('/slot1', getSlotMachineResult);

module.exports = router
