const express = require("express");
const router = express.Router();
const loginCollection = require("../models/loginModel"); 
const InquiryCollection = require("../models/inquiryModel"); 
const adminControllers = require("../controllers/admincontrollers");
const notificationController = require('../controllers/notificationcontrollers');

// ✅ Needed models for dynamic routes
const User = require("../models/loginModel");
const Notification = require("../models/notificationmodel");

// ✅ Send notification POST
router.post('/admin/send-notification', notificationController.sendNotification);

// ✅ Inquiry update POST
router.post("/inquiryupdate/:id", adminControllers.inquiryupdate);

// ✅ Dashboard GET
router.get("/admin/admindashboard", async (req, res) => {
  try {
    const studentCount = await loginCollection.countDocuments({ role: "student" });
    const teacherCount = await loginCollection.countDocuments({ role: "teacher" });
    const driverCount = await loginCollection.countDocuments({ role: "busincharge" });
    res.render("./admin/admindashboard", { studentCount, teacherCount, driverCount });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ Inquiry status filtered GET
router.get("/admin/inquiry/status/:status", adminControllers.getInquiriesByStatus);

// ✅ Add bus page
router.get("/admin/add-bus", (req, res) => {
  res.render("./admin/addbus");
});

// ✅ Inquiry page
router.get("/admin/inquiry", async (req, res) => {
  try {
    const inquiries = await InquiryCollection.find();
    if (!inquiries || inquiries.length === 0) {
      console.log("No inquiries found.");
    }
    res.render("./admin/inquiry", { inquiries });
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

// ✅ Notify page (dynamic) → include ALL roles
router.get("/admin/notify", async (req, res) => {
  try {
    const users = await User.find(
      {}, // 👉 find all users, regardless of role
      "fName lName email role"
    );
    res.render("./admin/notify", { users });
  } catch (error) {
    console.error("Error loading notify page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ Notifications history page
router.get("/admin/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('sender', 'fName lName email')
      .populate('recipients', 'fName lName email');
    res.render("./admin/notifications", { notifications });
  } catch (error) {
    console.error("Error loading notifications page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ✅ NEW: API to get users as JSON (for dynamic notify page) → include ALL roles
router.get('/admin/api/users', async (req, res) => {
  try {
    const users = await User.find(
      {}, // 👉 get all users
      "fName lName email role contactNo busNo routeNo paymentStatus status"
    );

    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.json({ success: false, message: "Error fetching users." });
  }
});

module.exports = router;
