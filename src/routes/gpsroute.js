const express = require("express");
const router = express.Router();
const { getGpsData, addGpsData } = require("../controllers/gpsController");

router.get("/", getGpsData);
router.post("/add", addGpsData);

module.exports = router;