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
router.post("/razorpay/submit", async (req, res) => {
  try {
    const {
      studentName, usn, branch, semester, email, pickupPoint, amount, razorpay_payment_id,
    } = req.body;

    if (!razorpay_payment_id) return res.send("Payment Failed");

    const payment = new PaymentCollection({
      studentName,
      usn,
      branch,
      semester,
      email,
      pickupPoint,
      amount,
      receiptId: `REC${Math.floor(Math.random() * 1000000)}`,
      paidDate: new Date().toLocaleDateString("en-GB"), // dd-mm-yyyy
    });

    await payment.save();
    res.send("Payment Successful and Saved!");
  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;