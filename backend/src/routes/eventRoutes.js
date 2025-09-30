const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAttendees
} = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEvent);

// Admin only routes
router.post('/', protect, adminOnly, createEvent);
router.put('/:id', protect, adminOnly, updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);
router.get('/:id/attendees', protect, adminOnly, getEventAttendees);

module.exports = router;