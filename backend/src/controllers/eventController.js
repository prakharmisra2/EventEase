const { Event, User, Booking } = require('../models');
const { Op } = require('sequelize');
const { formatDate } = require('../utils/dateFormatter');
const { generateEventId } = require('../utils/eventIdGenerator');

// @desc    Get all events with filters
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res) => {
  try {
    const { category, locationType, startDate, endDate, status } = req.query;
    
    // Build where clause
    const where = {};
    
    if (category) {
      where.category = category;
    }
    
    if (locationType) {
      where.locationType = locationType;
    }
    
    if (startDate && endDate) {
      where.eventDate = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      where.eventDate = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      where.eventDate = {
        [Op.lte]: endDate
      };
    }
    
    const events = await Event.findAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['eventDate', 'ASC']]
    });
    
    // Add computed fields
    const eventsWithDetails = events.map(event => {
      const eventData = event.toJSON();
      return {
        ...eventData,
        status: event.getStatus(),
        availableSeats: event.getAvailableSeats(),
        formattedDate: formatDate(event.eventDate)
      };
    });
    
    // Filter by status if provided
    let filteredEvents = eventsWithDetails;
    if (status) {
      filteredEvents = eventsWithDetails.filter(event => event.status === status);
    }
    
    res.status(200).json({
      success: true,
      count: filteredEvents.length,
      data: filteredEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const eventData = event.toJSON();
    
    res.status(200).json({
      success: true,
      data: {
        ...eventData,
        status: event.getStatus(),
        availableSeats: event.getAvailableSeats(),
        formattedDate: formatDate(event.eventDate)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      locationType,
      eventDate,
      startTime,
      endTime,
      capacity,
      imageUrl
    } = req.body;
    
    // Validation
    if (!title || !description || !category || !location || !locationType || 
        !eventDate || !startTime || !endTime || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    console.log("Creating event with data:", req.body);
    // Create event
    const event = await Event.create({
      eventId: generateEventId(eventDate),
      title,
      description,
      category,
      location,
      locationType,
      eventDate,
      startTime,
      endTime,
      capacity,
      imageUrl,
      createdBy: req.user.id
    });
    console.log("Event created:", event);
    const eventData = event.toJSON();
    console.log("creating event",eventData);
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: {
        ...eventData,
        status: event.getStatus(),
        availableSeats: event.getAvailableSeats(),
        formattedDate: formatDate(event.eventDate)
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const {
      title,
      description,
      category,
      location,
      locationType,
      eventDate,
      startTime,
      endTime,
      capacity,
      imageUrl
    } = req.body;
    
    // Update event
    await event.update({
      title: title || event.title,
      description: description || event.description,
      category: category || event.category,
      location: location || event.location,
      locationType: locationType || event.locationType,
      eventDate: eventDate || event.eventDate,
      startTime: startTime || event.startTime,
      endTime: endTime || event.endTime,
      capacity: capacity || event.capacity,
      imageUrl: imageUrl !== undefined ? imageUrl : event.imageUrl
    });
    
    const eventData = event.toJSON();
    
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: {
        ...eventData,
        status: event.getStatus(),
        availableSeats: event.getAvailableSeats(),
        formattedDate: formatDate(event.eventDate)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    await event.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get event attendees
// @route   GET /api/events/:id/attendees
// @access  Private/Admin
exports.getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    const bookings = await Booking.findAll({
      where: {
        eventId: req.params.id,
        status: 'confirmed'
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};