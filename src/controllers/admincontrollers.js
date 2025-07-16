const ProfileCollection = require("../models/profileModel");
const InquiryCollection = require("../models/inquiryModel"); 
const DriverCollection = require('../models/assign_bus');



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

exports.add_driver=async(req,res)=>{
  const { "driver-id": driverId,"name":name, "bus-number": busNumber, "route-number": routeNumber, "phone-number": phoneNumber } = req.body;

  try {
    await DriverCollection.create({
      driverId,
      name,
      busNumber,
      routeNumber,
      phoneNumber,
    });
     await ProfileCollection.findOneAndUpdate(
      { role: "busincharge", route_num: routeNumber },  // find driver by route number
      { $set: {driver_ID:driverId} }
    );

    res.redirect("/admin/driverdetails");
  } catch (err) {
    console.error("Error adding driver:", err);
    res.status(500).send("Internal Server Error");
  }
}

// Controller function
exports.deleteDriver = async (req, res) => {
  try {
    const driverId = req.params.driverId;

    // Step 1: Find driver by ID
    const driver = await DriverCollection.findOne({ driverId });
    if (!driver) return res.status(404).send("Driver not found");

    const routeNumber = driver.routeNumber;

  
   

    // Step 3: Remove reference from ProfileCollection
    await ProfileCollection.updateOne(
      { role: "busincharge", route_num: routeNumber },
      {
        $unset: {
          driver_ID: "",
          fName: "",
          lName: "",
          phone_num: "",
          license_num: "",
          DOB: "",
          joined_date: "",
          years_of_experience: "",
          address: "",
          postal_code: "",
          profileImage: ""
        }
      }
    );

    res.redirect("/admin/driverdetails");
  } catch (err) {
    console.error("Error deleting driver:", err);
    res.status(500).send("Internal Server Error");
  }
};
