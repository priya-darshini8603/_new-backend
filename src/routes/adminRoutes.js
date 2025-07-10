const express = require("express");
const router = express.Router();
const loginCollection = require("../models/loginModel"); 
// adjust path as needed

router.get("/admin/admindashboard", async (req, res) => {
  try {
    const studentCount = await loginCollection.countDocuments({ role: "student" });
    const teacherCount = await loginCollection.countDocuments({ role: "teacher" });
    const driverCount = await loginCollection.countDocuments({ role: "busincharge" });

    console.log(driverCount);
    res.render("./admin/admindashboard", { studentCount, teacherCount, driverCount });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    res.status(500).send("Internal Server Error");
  }
});


const multer = require("multer");
const BusDetails = require("../models/busdetailsModel");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/admin/add-bus", (req, res) => {
  res.render("./admin/addbus");
});

router.post("/admin/add-bus", upload.single("busImage"), async (req, res) => {
  try {
    const {
      busNumber,
      routeNumber,
      totalSeats,
      availableSeats,
      pickupPoints,
      lastServiceDate,
      nextServiceDate
    } = req.body;

    const newBus = new BusDetails({
      busNumber,
      routeNumber,
      totalSeats,
      availableSeats,
      pickupPoints,
      lastServiceDate,
      nextServiceDate,
      image: req.file.buffer,
      imageType: req.file.mimetype
    });

    await newBus.save();
    
    res.redirect("/admin/addbus");
  } catch (err) {
    console.error("Error adding bus:", err);
    res.status(500).send("Failed to add bus.");
  }
});




module.exports = router;
