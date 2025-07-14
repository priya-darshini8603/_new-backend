const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    owner:String,
    name: String,
    displayName:String,
    role:String,
    avatar:String,
    lastMessage: String,
    lastMessageTime: String,
    unreadCount: {type: Number,
    default: 0,
    }
});

const ContactCollection = mongoose.model("ContactCollection", contactSchema);
module.exports= ContactCollection;