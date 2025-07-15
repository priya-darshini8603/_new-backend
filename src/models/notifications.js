const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userEmail: String, // Who should receive it
  message: String,
  link: String, // Optional: redirect to a page
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const NotificationCollection = mongoose.model("NotificationCollection", notificationSchema);

module.exports =  NotificationCollection;