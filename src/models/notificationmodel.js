const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  message: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipients: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
