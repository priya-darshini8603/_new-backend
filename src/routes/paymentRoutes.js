const express = require("express");
const router = express.Router();

const paymentcontrollers = require("../controllers/paymentcontrollers");
const PaymentCollection = require("../models/paymentModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Configure Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_XLEobc5mihNeOK", // replace with your test key
  key_secret: "your_secret_key"
});

router.get("/payment",(req,res)=>res.render("payment"));
function generatePaymentRefId() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PAY-${year}-${random}`;
}

router.post("/razorpay/submit", async (req, res) => {
  try {
    const {
      studentName,
      usn,
      branch,
      semester,
      email,
      pickupPoint,
      amount,
      phone_num,
      razorpay_payment_id,
    } = req.body;

    if (!razorpay_payment_id) return res.send("Payment Failed");

    // Generate a unique payment_ref_id
    let paymentRefId;
    let existing;
    do {
      paymentRefId = generatePaymentRefId();
      existing = await PaymentCollection.findOne({ payment_ref_id: paymentRefId });
    } while (existing);

    // Create and save the payment
    const payment = new PaymentCollection({
      studentName,
      usn,
      branch,
      semester,
      email,
      pickupPoint,
      amount,
      phone_num,
      razorpay_payment_id,
      payment_ref_id: paymentRefId,
      receiptId: `REC${Math.floor(Math.random() * 1000000)}`,
      paidDate: new Date().toLocaleDateString("en-GB"), // Format: dd-mm-yyyy
    });

    await payment.save();

    res.send("Payment Successful and Saved!");
  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;