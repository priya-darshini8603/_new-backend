const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  studentName: String,
  usn: String,
  branch: String,
  semester: String,
  routeNUmber:Number,
  pickupPoint: String,
  amount: Number,
  phone_num:Number,
  razorpay_payment_id: {
  type: String,
  required: true
},
  status: String,
  createdAt: { type: Date, default: Date.now },
  payment_ref_id: {
  type: String,
  required: true,
  unique: true
},


});

const PaymentCollection = mongoose.model("PaymentCollection", paymentSchema);

module.exports =  PaymentCollection;
