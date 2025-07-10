const express = require("express");
const router = express.Router();

const ProfileCollection = require("../models/profileModel");
const profileControllers = require("../controllers/profilecontrollers");

router.get("/bus-incharge/profile", async (req, res) => {
  try {
    const email = req.query.email || req.session?.user?.email;
   
    if (!email) return res.redirect("/loginform")
    
   const profile = await ProfileCollection.findOne({ email })// Important: .lean() converts it to plain object

  let profileImageBase64 = null;
  let profileImageType = "image/jpeg";
  if (profile?.profileImage?.data) {
      profileImageBase64 = profile.profileImage.data.toString("base64");
      profileImageType = profile.profileImage.contentType || "image/jpeg";
    }

   
    
    res.render("./bus-incharge/profile", { profile,profileImageBase64,profileImageType });
  } catch (err) {
    console.error("Error loading profile:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/profileupdate", profileControllers.uploadMiddleware, profileControllers.profileupdate);

module.exports = router;
