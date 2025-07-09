const Admin = require("../models/Admin");

// POST /admin/profile/update
exports.updateProfileAdmin = async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;

    let admin = await Admin.findOne({ email });

    if (!admin) {
      admin = new Admin({ name, email, password, profilePic });
    } else {
      admin.name = name;
      admin.password = password;
      admin.profilePic = profilePic;
    }

    await admin.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
};
