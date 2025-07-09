const express = require("express");
const router = express.Router();

const ProfileCollection = require("../models/profileModel");
const profileControllers = require("../controllers/profilecontrollers");

router.get("/bus-incharge/profile", async (req, res) => {
  try {
    const email = req.query.email || req.session?.user?.email;
   
    if (!email) return res.status(400).send("Missing email");
    
    const profile = await ProfileCollection.findOne({ email });
    console.log(profile);
    res.render("./bus-incharge/profile", { profile });
  } catch (err) {
    console.error("Error loading profile:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/profileupdate", profileControllers.profileupdate);

module.exports = router;
