const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  title:String,
  message: { type: String, required: true },
  senderRole: String,
  recipientRole: {type:String,required:true},
  type:{type:String},
  createdAt: { type: Date, default: Date.now }
});

const NotificationCollection = mongoose.model("NotificationCollection", NotificationSchema);

module.exports =  NotificationCollection;
