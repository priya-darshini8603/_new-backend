// helpers/notificationSender.js
const Notification = require("../models/notifications");



async function sendNotification({ userEmail, message, link }) {
  // Save to DB
  await Notification.create({ userEmail, message, link });

  // Emit in real-time if user is online
  const socketId = users[userEmail];
  if (socketId) {
    io.to(socketId).emit("notification", { message, link });
  }
}

module.exports = sendNotification;
