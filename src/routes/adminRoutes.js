const express = require("express");
const router = express.Router();
const loginCollection = require("../models/loginModel"); 
const InquiryCollection = require("../models/inquiryModel"); 
const adminControllers = require("../controllers/admincontrollers");
// adjust path as needed
const notificationController = require('../controllers/notificationcontrollers');

router.post('/admin/send-notification', notificationController.sendNotification);

router.post("/inquiryupdate/:id",adminControllers.inquiryupdate);

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



router.get("/admin/inquiry/status/:status", adminControllers.getInquiriesByStatus);
router.get("/admin/add-bus", (req, res) => {
  res.render("./admin/addbus");
});

router.get("/admin/inquiry",async (req,res)=>{
  try{
    const inquiries=await InquiryCollection.find()
     if (!inquiries || inquiries.length === 0) {
      console.log("No inquiries found.");
    }
     console.log(inquiries);
    res.render("./admin/inquiry", {inquiries});
   
  }
  catch{
    res.status(500).send("Internal Server Error");
  }
})



module.exports = router;
