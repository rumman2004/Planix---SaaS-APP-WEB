const notificationService = {
  sendInAppNotification(userId, message) {
    // TODO (Phase 4): Connect to WebSockets/Socket.io to push real-time alerts to the React frontend
    console.log(`🔔 [IN-APP ALERT] -> User ID: ${userId} | Message: ${message}`);
  },

  sendPushNotification(userId, message) {
    // TODO (Future Mobile Phase): Connect to Firebase Cloud Messaging (FCM) or Expo Push Notifications
    console.log(`📱 [PUSH NOTIFICATION] -> User ID: ${userId} | Message: ${message}`);
  },

  sendEmailReminder(userEmail, subject, message) {
    // TODO: Connect to Nodemailer or SendGrid
    console.log(`📧 [EMAIL] -> To: ${userEmail} | Subject: ${subject}`);
  }
};

module.exports = notificationService;