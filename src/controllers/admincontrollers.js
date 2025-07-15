const ProfileCollection = require("../models/profileModel");
const InquiryCollection = require("../models/inquiryModel"); 



  
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