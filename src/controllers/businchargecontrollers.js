const ProfileCollection = require("../models/profileModel");
const Message = require("../models/Message");
const Contact = require("../models/Contact");
const multer = require("multer");
const InquiryCollection=require("../models/inquiryModel");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
exports.uploadMiddleware = upload.single("profileImage");
exports.profileupdate = async (req, res) => {
  try {
    const updateData = {
      fName: req.body.fName,
      lName: req.body.lName,
      gender: req.body.gender,
      phone_num: req.body.phone_num,
      license_num: req.body.license_num,
      DOB: req.body.DOB,
      joined_date: req.body.joined_date,
      years_of_experience: req.body.years_of_experience,
      address: req.body.address,
      postal_code: req.body.postal_code,
      route_num: req.body.route_num,
     
    };
   if (req.file) {
      updateData.profileImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

    await ProfileCollection.updateOne(
      { email: req.body.email },
      { $set: updateData },
      { upsert: true }
    );

     res.redirect("/bus-incharge/profile?status=success");
  } catch (err) {
    console.error("Profile update error:", err);
    
    res.redirect("/bus-incharge/profile");
  }
};
function generateInquiryRefId() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `INQ${year}-${random}`;
}
exports.submitinquiry = async (req, res) => {
  try {
    let inquiryRefId;
    let existing;

    // Ensure unique inquiry_ref_id
    do {
      inquiryRefId = generateInquiryRefId();
      existing = await InquiryCollection.findOne({ inquiry_ref_id: inquiryRefId });
    } while (existing);

    const newInquiry = new InquiryCollection({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone,
      email: req.body.email,
      route: req.body.route,
      priority: req.body.priority,
      message: req.body.message,
      inquiry_ref_id: inquiryRefId
    });

    await newInquiry.save();
    res.redirect("/bus-incharge/inquiry"); // or wherever you want to redirect
  } catch (err) {
    console.error("Failed to submit inquiry:", err);
    res.status(500).send("Error saving inquiry");
  }
};




