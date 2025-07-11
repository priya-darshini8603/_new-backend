const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  studentName: String,
  usn: String,
  branch: String,
  semester: String,
  routeNUmber:Number,
  pickupPoint: String,
  amount: Number,
  paymentId: String,
  status: String,
  createdAt: { type: Date, default: Date.now }

});

const PaymentCollection = mongoose.model("PaymentCollection", paymentSchema);

module.exports =  PaymentCollection;
