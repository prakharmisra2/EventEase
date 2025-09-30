const { formatDateTime } = require('../utils/dateFormatter');

const bookingLogger = (req, res, next) => {
  // Store original send function
  const originalSend = res.json;
  
  // Override send function
  res.json = function(data) {
    // Only log successful bookings (status 200 or 201)
    if ((res.statusCode === 200 || res.statusCode === 201) && data.success) {
      const logMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 NEW BOOKING CREATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 User: ${req.user.name} (${req.user.email})
🎫 Event: ${data.data?.event?.title || 'N/A'}
💺 Seats: ${data.data?.seats || 'N/A'}
🕐 Timestamp: ${formatDateTime(new Date())}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `;
      console.log(logMessage);
    }
    
    // Call original send function
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = bookingLogger;