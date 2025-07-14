const Razorpay = require('razorpay');
const crypto = require('crypto');
const PaymentCollection = require('../models/paymentModel');
const config = require('../config/razorpay');

const razorpay = new Razorpay({
  key_id:'rzp_test_XLEobc5mihNeOK',
  key_secret:'nUMwcrj3cYvjfT4XSB0IHhTl'
});

module.exports = {
  createOrder: async (req, res) => {
    try {
      
      const { route, email, amount } = req.body;
      const options = {
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      };
     
      const order = await razorpay.orders.create(options);
      
      
      const newPayment = new PaymentCollection({
        email,
        route,
        amount,
        orderId: order.id,
        status: "Pending"
      });

      await newPayment.save();
      res.json({ success: true, order });
      
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create order', error });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
      console("at verification");
      console.log(req.body);
      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }
      const hmac = crypto.createHmac('sha256','nUMwcrj3cYvjfT4XSB0IHhTl');
      hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
      const generatedSignature = hmac.digest('hex');
      console.log('Generated Signature:', generatedSignature); // Log the generated signature
      console.log('Received Signature:', razorpay_signature);

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Payment verification failed' });
      }

      const payment = await PaymentCollection.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { $set: { paymentId: razorpay_payment_id, status: 'successful' } },
        { new: true }
      );

      res.json({ success: true, message: 'Payment verified successfully', payment });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
  }
};
