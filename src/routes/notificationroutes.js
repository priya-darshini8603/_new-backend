const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationcontrollers');

// POST - send notification
router.post('/send-notification', notificationController.sendNotification);

// ✅ ADD THIS if missing:
router.get('/all', notificationController.getAllNotifications);

module.exports = router;
