const express = require("express");
const router = express.Router();
const BusCollection = require("../models/busdetailsModel");
const ProfileCollection = require("../models/profileModel");
const PaymentCollection = require("../models/paymentModel");
const businchargeControllers = require("../controllers/businchargecontrollers");
const loginCollection = require("../models/loginModel"); 

//post methods
router.post("/profileupdate", businchargeControllers.uploadMiddleware,businchargeControllers.profileupdate);
router.post("/submitinquiry",businchargeControllers.submitinquiry);







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
  .limit(2)
payments.forEach(payment => {
  if (payment.createdAt) {
    const date = new Date(payment.createdAt);
    payment.createdAtFormatted = date.toLocaleDateString('en-GB'); // DD-MM-YYYY
  }
});
const email = req.query.email || req.session?.user?.email;
const profile = await ProfileCollection.findOne({ email })// Important: .lean() converts it to plain object

  let profileImageBase64 = null;
  let profileImageType = "image/jpeg";
  if (profile?.profileImage?.data) {
      profileImageBase64 = profile.profileImage.data.toString("base64");
      profileImageType = profile.profileImage.contentType || "image/jpeg";
    }

    
    res.render("./bus-incharge/busincharge-dashboard", { studentCount, teacherCount, driverCount,paidCount,unpaidCount,payments,newUsers:allNewUsers,profileImageBase64,profileImageType });
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
    const email = req.session?.user?.email; // or req.query.email if using query
    if (!email) return res.redirect("/loginform");

    // Get assigned route number for the busincharge
    const profile = await ProfileCollection.findOne({ email });
    const assignedRouteNumber = Number(profile?.route_num); 
     let profileImageBase64 = null;
  let profileImageType = "image/jpeg";
  if (profile?.profileImage?.data) {
      profileImageBase64 = profile.profileImage.data.toString("base64");
      profileImageType = profile.profileImage.contentType || "image/jpeg";
    }
    const bus = await BusCollection.findOne({ routeNumber: assignedRouteNumber });
    
  let busImageBase64 = null;
    let busImageType = "image/jpeg";

    if (bus?.image) {
      busImageBase64 = bus.image.toString("base64");
      busImageType = bus.imageType || "image/jpeg";
    }

    res.render("./bus-incharge/busdetails", {
      profileImageBase64,
      profileImageType,
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
    const email = req.query.email || req.session?.user?.email;
      const profile = await ProfileCollection.findOne({ email })// Important: .lean() converts it to plain object

  let profileImageBase64 = null;
  let profileImageType = "image/jpeg";
  if (profile?.profileImage?.data) {
      profileImageBase64 = profile.profileImage.data.toString("base64");
      profileImageType = profile.profileImage.contentType || "image/jpeg";
    }
     const payment = await PaymentCollection.findOne({ payment_ref_id: req.params.ref_id }).lean();
    if (!payment) return res.status(404).send("Payment not found");
   

    // Format date
    const date = new Date(payment.createdAt);
    payment.formattedDate = date.toLocaleDateString('en-GB'); // dd-mm-yyyy
    
    res.render("bus-incharge/view-payments", { payment,profileImageBase64,profileImageType });
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
    const email = req.query.email || req.session?.user?.email;
    const profile = await ProfileCollection.findOne({ email })// Important: .lean() converts it to plain object

  let profileImageBase64 = null;
  let profileImageType = "image/jpeg";
  if (profile?.profileImage?.data) {
      profileImageBase64 = profile.profileImage.data.toString("base64");
      profileImageType = profile.profileImage.contentType || "image/jpeg";
    }
  const payments=await PaymentCollection.find().lean()
   payments.forEach(payment => {
      const date = new Date(payment.createdAt);
      payment.formattedDate = !isNaN(date) ? date.toLocaleDateString('en-GB') : 'N/A';
    });
    
  res.render("bus-incharge/view-all-payments", { payments,profileImageBase64,profileImageType });
  }
  catch{
    res.status(500).send("Internal Server Error");
  }
})


router.get("/bus-incharge/studentdetails",async (req,res)=>{
  try{
    const email = req.query.email || req.session?.user?.email;
    const profile = await ProfileCollection.findOne({ email })// Important: .lean() converts it to plain object

  let profileImageBase64 = null;
  let profileImageType = "image/jpeg";
  if (profile?.profileImage?.data) {
      profileImageBase64 = profile.profileImage.data.toString("base64");
      profileImageType = profile.profileImage.contentType || "image/jpeg";
    }
    //need to change to profile after student page updated
    const students=await loginCollection.find({role:"student"}).lean()
    res.render("bus-incharge/studentdetails",  {students,profileImageBase64,profileImageType});
    
  }
  catch{
    res.status(500).send("Internal Server Error");
  }
});


router.get("/bus-incharge/staffdetails",async (req,res)=>{
  try{
    const email = req.query.email || req.session?.user?.email;
    const profile = await ProfileCollection.findOne({ email })// Important: .lean() converts it to plain object

  let profileImageBase64 = null;
  let profileImageType = "image/jpeg";
  if (profile?.profileImage?.data) {
      profileImageBase64 = profile.profileImage.data.toString("base64");
      profileImageType = profile.profileImage.contentType || "image/jpeg";
    }
    //need to change to profile after student page updated
    const staff=await loginCollection.find({role:"teacher"}).lean()
    
    res.render("bus-incharge/staffdetails", { staff,profileImageBase64,profileImageType });
    
  }
  catch{
    res.status(500).send("Internal Server Error");
  }
});

router.get("/bus-incharge/inquiry", async (req, res) => {
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

   
    
    res.render("./bus-incharge/inquiry", { profileImageBase64,profileImageType });
  } catch (err) {
    console.error("Error loading profile:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
