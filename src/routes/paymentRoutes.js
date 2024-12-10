const express = require("express");
const router = express.Router();

const paymentcontrollers = require("../controllers/paymentcontrollers");

router.get("/payment", (req, res) => {
    res.render('payment', {
        razorpay_key: process.env.RAZORPAY_KEY_ID
    });
});

router.post('/create-order', paymentcontrollers.createOrder);
router.post('/verify-payment', paymentcontrollers.verifyPayment);

module.exports = router;
