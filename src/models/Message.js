const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: String,
    receiver:String,
    text: String,
    createdAt: { type: Date, default: Date.now }
});

const MessageCollection = mongoose.model("MessageCollection", messageSchema);
module.exports= MessageCollection;