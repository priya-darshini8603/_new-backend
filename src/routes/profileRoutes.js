const express = require("express");
const router = express.Router();
const profileControllers = require("../controllers/profilecontrollers");

// POST: Update admin profile
router.post("/updateProfileAdmin", profileControllers.updateProfileAdmin);

module.exports = router;
