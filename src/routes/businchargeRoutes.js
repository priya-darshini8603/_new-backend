const express = require("express");
const router = express.Router();
const BusCollection = require("../models/busdetailsModel");
const ProfileCollection = require("../models/profileModel");
const PaymentCollection = require("../models/paymentModel");
const businchargeControllers = require("../controllers/businchargecontrollers");
const loginCollection = require("../models/loginModel"); 
const mongoose = require("mongoose");

//post methods
router.post("/profileupdate", businchargeControllers.uploadMiddleware,businchargeControllers.profileupdate);
router.post("/submitinquiry",businchargeControllers.submitinquiry);
router.get("/busincharge/chat", businchargeControllers.renderChatPage);





// Middleware: applies to all /bus-incharge/* routes
router.use("/bus-incharge", async (req, res, next) => {
  try {
    const email = req.session?.user?.email;
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

    next();
  } catch (error) {
    console.error("Bus-incharge profile image middleware error:", error);
    res.status(500).send("Something went wrong");
  }
});


router.get("/bus-incharge/busincharge-dashboard", async (req, res) => {
  try {
    const studentCount = await loginCollection.countDocuments({ role: "student" });
    const teacherCount = await loginCollection.countDocuments({ role: "teacher" });
    const driverCount = await loginCollection.countDocuments({ role: "busincharge" });
    const paidCount=await PaymentCollection.countDocuments({status:"sucess"})
    const unpaidCount=await PaymentCollection.countDocuments({status:"Pending"})
    const allNewUsers = await ProfileCollection.find({
  role: { $in: ["student", "teacher"] }
})
.sort({ createdAt: -1 }) // latest first
.limit(5)                // adjust count as needed
.lean();
const payments = await PaymentCollection
  .find()
  .sort({ createdAt: -1 }) // sort newest first
  .limit(5)
payments.forEach(payment => {
  if (payment.createdAt) {
    const date = new Date(payment.createdAt);
    payment.createdAtFormatted = date.toLocaleDateString('en-GB'); // DD-MM-YYYY
  }
}); 
res.render("./bus-incharge/busincharge-dashboard", { studentCount, teacherCount, driverCount,paidCount,unpaidCount,payments,newUsers:allNewUsers });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    res.status(500).send("Internal Server Error");
  }
});


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



router.get("/bus-incharge/busdetails", async (req, res) => {
  try {
     const email = req.session?.user?.email;
    if (!email) return res.redirect("/loginform");

    // Step 1: Get bus-incharge's profile
    const profile = await ProfileCollection.findOne({ email });

    if (!profile || !profile.route_num) {
      return res.status(404).send("No assigned route found for this user.");
    }

    const assignedRouteNumber = profile.route_num;
    // Get assigned route number for the busincharge 
    const bus = await BusCollection.findOne({ routeNumber: assignedRouteNumber });
    
  let busImageBase64 = null;
    let busImageType = "image/jpeg";

    if (bus?.image) {
      busImageBase64 = bus.image.toString("base64");
      busImageType = bus.imageType || "image/jpeg";
    }

    res.render("./bus-incharge/busdetails", {
      bus,
      busImageBase64,
      busImageType,
      message: null,
    });
  }   
  catch (error) {
    console.error("Error fetching bus details:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/bus-incharge/view-payments/:ref_id", async (req, res) => {
  try {
    
    
     const payment = await PaymentCollection.findOne({ payment_ref_id: req.params.ref_id }).lean();
    if (!payment) return res.status(404).send("Payment not found");
   

    // Format date
    const date = new Date(payment.createdAt);
    payment.formattedDate = date.toLocaleDateString('en-GB'); // dd-mm-yyyy
    
    res.render("bus-incharge/view-payments", { payment});
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


router.get("/bus-incharge/view-all-payments",async (req,res)=>{
  try{
   
  const payments=await PaymentCollection.find().lean()
   payments.forEach(payment => {
      const date = new Date(payment.createdAt);
      payment.formattedDate = !isNaN(date) ? date.toLocaleDateString('en-GB') : 'N/A';
    });
    
  res.render("bus-incharge/view-all-payments", { payments });
  }
  catch{
    res.status(500).send("Internal Server Error");
  }
})


router.get("/bus-incharge/studentdetails",async (req,res)=>{
  try{
   
    //need to change to profile after student page updated
    const students=await loginCollection.find({role:"student"}).lean()
    res.render("bus-incharge/studentdetails",  {students});
    
  }
  catch{
    res.status(500).send("Internal Server Error");
  }
});


router.get("/bus-incharge/staffdetails",async (req,res)=>{
  try{
    
    //need to change to profile after student page updated
    const staff=await loginCollection.find({role:"teacher"}).lean()
    
    res.render("bus-incharge/staffdetails", { staff });
    
  }
  catch{
    res.status(500).send("Internal Server Error");
  }
});

router.get("/bus-incharge/schedule", async (req, res) => {
  try {
    const email = req.session?.user?.email;
    if (!email) return res.redirect("/loginform");

    const profile = await ProfileCollection.findOne({ email });
    const routeNumber = profile?.route_num;

    if (!routeNumber) return res.status(404).send("No route assigned");

    //connect directly from database stored collection
    
    const busData = await mongoose.connection.db
      .collection("routelists") // your route list collection name
      .findOne({ routeNumber:"profile.route_num"});
    
    res.render("bus-incharge/schedule", {
      pickupPoints: busData?.pickupSchedule || [],
    });
  } catch (err) {
    console.error("Error loading pickup points:", err);
    res.status(500).send("Internal Server Error");
  }
});



module.exports = router;
