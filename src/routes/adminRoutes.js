
const express = require("express");
const router = express.Router();
const loginCollection = require("../models/loginModel"); 
const InquiryCollection = require("../models/inquiryModel"); 
const adminControllers = require("../controllers/admincontrollers");
const notificationController = require('../controllers/notificationcontrollers');
const Notification = require("../models/notificationmodel");
const ProfileCollection = require("../models/profileModel");
const PaymentCollection = require("../models/paymentModel");
const DriverCollection = require('../models/assign_bus');

const multer = require('multer');
const upload = multer();

router.post('/admin/send-notification', notificationController.sendNotification);
router.post("/inquiryupdate/:id", adminControllers.inquiryupdate);
router.post("/Adminprofileupdate",upload.single('profileImage'),adminControllers.Adminprofileupdate);
router.post("/admin/add_driver",adminControllers.add_driver);
router.get("/admin/delete_driver/:driverId", adminControllers.deleteDriver);



router.use("/admin", async (req, res, next) => {
  try {
    const email = req.session?.user?.email;
     const role = req.session?.user?.role;
    if (!email) return res.redirect("/loginform");

    const profile = await ProfileCollection.findOne({ email });

    if (profile?.profileImage?.data) {
      const profileImageBase64 = profile.profileImage.data.toString("base64");
      const profileImageType = profile.profileImage.contentType || "image/jpeg";
      res.locals.profileImageBase64 = profileImageBase64;
      res.locals.profileImageType = profileImageType;
    } else {
      res.locals.profileImageBase64 = null;
      res.locals.profileImageType = "image/jpeg";
    }
     const notifications = await Notification.find({ recipientRole: role })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();
    
        res.locals.notifications = notifications;
        res.locals.notificationCount = notifications.length;
    
    next();
  } catch (error) {
    console.error("Bus-incharge profile image middleware error:", error);
    res.status(500).send("Something went wrong");
  }
});

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
router.get("/admin/view-profile", async (req, res) => {
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

   
    
    res.render("./admin/view-profile", { profile,profileImageBase64,profileImageType });
  } catch (err) {
    console.error("Error loading profile:", err);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/admin/inquiry/status/:status", adminControllers.getInquiriesByStatus);

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


router.get("/admin/payment-records",async (req,res)=>{
  try{
   
  const payments=await PaymentCollection.find().lean()
   payments.forEach(payment => {
      const date = new Date(payment.createdAt);
      payment.formattedDate = !isNaN(date) ? date.toLocaleDateString('en-GB') : 'N/A';
    });
    
  res.render("admin/payment-records", { payments });
  }
  catch{
    res.status(500).send("Internal Server Error");
  }
})


router.get("/admin/view_payments/:ref_id", async (req, res) => {
  try {
    
    
     const payment = await PaymentCollection.findOne({ payment_ref_id: req.params.ref_id }).lean();
    if (!payment) return res.status(404).send("Payment not found");
   

    // Format date
    const date = new Date(payment.createdAt);
    payment.formattedDate = date.toLocaleDateString('en-GB'); // dd-mm-yyyy
    
    res.render("admin/view_payments", { payment});
  } catch (err) {
    console.error("Error fetching payment:", err);
    res.status(500).send("Internal Server Error");
  }
});
function generatePaymentRefId() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PAY-${year}-${random}`;
}

router.get("/admin/studentdetails",async (req,res)=>{
  try{
   
    //need to change to profile after student page updated
    const students=await loginCollection.find({role:"student"}).lean()
   
    res.render("admin/studentdetails", {students});
    
  }
  catch{
    res.status(500).send("Internal Server Error");
  }
});

router.get("/admin/teacherdetails",async (req,res)=>{
  try{
   
    //need to change to profile after student page updated
    const teachers=await loginCollection.find({role:"teacher"}).lean()
    
    res.render("admin/teacherdetails", {teachers});
    
  }
  catch{
    res.status(500).send("Internal Server Error");
  }
});



router.get("/admin/driverdetails",async (req,res)=>{
  try {
    const drivers = await DriverCollection.find().lean();

    for (let driver of drivers) {
      const profile = await ProfileCollection.findOne({
        role: "busincharge",
        route_num: driver.routeNumber
      }).lean();

      // Combine profile data into driver
      if (profile) {
        driver.name = `${profile.fName} ${profile.lName}` || "N/A";
        driver.phoneNumber = profile.phone_num || "N/A";
      } else {
        driver.name = "N/A";
        driver.phoneNumber = "N/A";
      }
    }

    res.render("admin/driverdetails", { drivers });
  } catch (err) {
    console.error("Error loading drivers:", err);
    res.status(500).send("Internal Server Error");
  }
});





router.get("/admin/notify", async (req, res) => {
  try {
    const users = await loginCollection.find(
      {}, // 👉 find all users, regardless of role
      "fName lName email role"
    );
    res.render("./admin/notify", { users });
  } catch (error) {
    console.error("Error loading notify page:", error);
    res.status(500).send("Internal Server Error");
  }
});





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

router.get('/admin/notification', async (req, res) => {
  try {
    
    const role = req.session.user?.role;

    const notifications = await Notification.find({
     
       
        recipientRole: role 
    
    }).sort({ createdAt: -1 }).limit(5).lean();

    const notificationCount = notifications.length;
 res.render('admin/notification', {
      user: req.session.user,
      notifications,
      notificationCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.render('bus-incharge/notification', {
      user: req.session.user,
      notifications: [],
      notificationCount: 0
    });
  }
});

module.exports = router;
