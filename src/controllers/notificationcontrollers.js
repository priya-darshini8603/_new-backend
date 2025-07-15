const Notification = require('../models/notificationmodel');
const User = require('../models/loginModel');

exports.sendNotification = async (req, res) => {
  try {
    console.log("Incoming req.body:", req.body);
    console.log("Session user:", req.session.user);

    const { recipientNames, message } = req.body;
    const senderId = req.session.user && req.session.user._id;

    // Validation
    if (!recipientNames || !recipientNames.length || !message || !senderId) {
      console.error("Validation failed:", { recipientNames, message, senderId });
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    // Fetch all users with names and IDs
    const allUsers = await User.find({}, 'fName lName _id');
    console.log("✅ Users in DB:");
    allUsers.forEach(u =>
      console.log(` - ${u._id}: "${(u.fName || '').trim()} ${(u.lName || '').trim()}"`)
    );

    // Normalize recipientNames for comparison
    const normalizedRecipientNames = recipientNames.map(name => name.trim().toLowerCase());

    // Match users robustly (skip null names)
    const matchedUsers = allUsers.filter(u => {
      const fName = u.fName ? u.fName.trim() : '';
      const lName = u.lName ? u.lName.trim() : '';
      const fullName = `${fName} ${lName}`.toLowerCase();
      return normalizedRecipientNames.includes(fullName);
    });

    console.log("✅ Matched Users:", matchedUsers.map(u => `${u._id}: ${u.fName} ${u.lName}`));

    if (!matchedUsers.length) {
      return res.status(404).json({ success: false, message: 'No matching users found. Check names carefully.' });
    }

    const recipientIds = matchedUsers.map(u => u._id);

    // Create and save notification
    const newNotification = new Notification({
      message,
      sender: senderId,
      recipients: recipientIds
    });

    await newNotification.save();

    console.log('✅ Notification saved in MongoDB!');
    console.log('Message:', message);
    console.log('Sender ID:', senderId);
    console.log('Recipient IDs:', recipientIds);

    return res.status(200).json({ success: true, message: 'Notification sent successfully.' });

  } catch (error) {
    console.error('❌ Error sending notification:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('sender', 'fName lName email')
      .populate('recipients', 'fName lName email');

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
