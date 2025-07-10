const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  fName: String,
  lName:String,
  role:String,
  email: String,
  profilePic: String, 
  driver_ID: String,
  gender:String,
  phone_num:String,
  license_num:String,
  DOB:String,
  joined_date:String,
  years_of_experience:String,
  address: String,
  postal_code:String,
  route_num:String,
  profileImage: {
  data: Buffer,
  contentType: String}
  // store base64 or file path
});

const ProfileCollection = mongoose.model("ProfileCollection", profileSchema);
module.exports=ProfileCollection;
