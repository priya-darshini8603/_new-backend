const express = require('express');
const { saveLocation } = require('../controllers/locationControllers.js');
const router = express.Router();

router.post('/save', saveLocation);

module.exports = router;