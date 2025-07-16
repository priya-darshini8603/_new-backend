const ProfileCollection = require("../models/profileModel");
const InquiryCollection = require("../models/inquiryModel"); 



exports.Adminprofileupdate = async (req, res) => {
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

     res.redirect("/admin/view-profile?status=success");
  } catch (err) {
    console.error("Profile update error:", err);
    
    res.redirect("/admin/view-profile?status=error");
  }
};

exports.inquiryupdate = async (req, res) => {
  try {
    const inquiryId = req.params.id;
    const newStatus = req.body.status;

    await InquiryCollection.findByIdAndUpdate(inquiryId, { status: newStatus });

    res.redirect("/admin/inquiry");
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).send("Failed to update status");
  }
};
exports.getInquiriesByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    let filter = {};

    if (status !== "All") {
      filter.status = status;
    }

    const inquiries = await InquiryCollection.find(filter).lean();
    res.json(inquiries); // Send data as JSON
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
};