const express = require("express");
const router = express.Router();
const LoginCollection = require("../models/LoginCollection");

// Render student list using handlebars
router.get("/studentlist", async (req, res) => {
  try {
    const students = await LoginCollection.find({ role: "student" });
    res.render("admin/studentdetails", { students }); // renders studentlist.hbs
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
