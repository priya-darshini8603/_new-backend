const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    email: String,
    route: String,
    amount: Number,
    orderId: String,
    paymentId: String,
    status: String,
    createdAt: { type: Date, default: Date.now },
});

const PaymentCollection = mongoose.model("PaymentCollection", paymentSchema);

module.exports =  PaymentCollection;
