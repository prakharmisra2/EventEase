
const Event = require('./Event.js');
const Booking = require('./Booking.js');

const User = require('./User');

// User - Event relationship (creator)
User.hasMany(Event, {
  foreignKey: 'createdBy',
  as: 'createdEvents'
});
Event.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

// User - Booking relationship
User.hasMany(Booking, {
  foreignKey: 'userId',
  as: 'bookings'
});
Booking.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Event - Booking relationship
Event.hasMany(Booking, {
  foreignKey: 'eventId',
  as: 'bookings'
});
Booking.belongsTo(Event, {
  foreignKey: 'eventId',
  as: 'event'
});

module.exports = {
  User,
  Event,
  Booking
};