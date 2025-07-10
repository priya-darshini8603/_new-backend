const ProfileCollection = require("../models/profileModel");
const multer = require("multer");
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
