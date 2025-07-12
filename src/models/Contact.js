const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: String,
    lastMessage: String,
    lastMessageTime: String,
    unreadCount: Number,
});

const ContactCollection = mongoose.model("ContactCollection", contactSchema);
module.exports= ContactCollection;