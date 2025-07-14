const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  first_name: String,
  last_name:String,
  phone:Number,
  email: String,
  route:Number,
  priority:{type:String,required:true,enum: ["low", "medium","high"]},
  status: {
    type: String,
    enum: ["Pending", "Ongoing", "Solved"],
    default: "Pending"
  },
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
inquiry_ref_id: {
  type: String,
  required: true,
  unique: true
}
});

const InquiryCollection = mongoose.model("InquiryCollection", inquirySchema);
module.exports= InquiryCollection;
