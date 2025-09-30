const { Booking, Event, User } = require('../models');
const { sequelize } = require('../config/database');
const { formatDate } = require('../utils/dateFormatter');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { eventId, seats } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (!eventId || !seats) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please provide event ID and number of seats'
      });
    }
    
    // Validate seats (max 2)
    if (seats < 1 || seats > 2) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'You can only book 1 or 2 seats per event'
      });
    }
    
    // Get event with lock
    const event = await Event.findByPk(eventId, {
      lock: transaction.LOCK.UPDATE,
      transaction
    });
    
    if (!event) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if event has already started or completed
    const eventStatus = event.getStatus();
    if (eventStatus === 'Ongoing' || eventStatus === 'Completed') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Cannot book ${eventStatus.toLowerCase()} event`
      });
    }
    
    // Check if user already has a booking for this event
    const existingBooking = await Booking.findOne({
      where: {
        userId,
        eventId,
        status: 'confirmed'
      },
      transaction
    });
    
    if (existingBooking) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'You already have a booking for this event'
      });
    }
    
    // Check available seats
    const availableSeats = event.capacity - event.bookedSeats;
    if (availableSeats < seats) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Only ${availableSeats} seat(s) available`
      });
    }
    
    // Create booking
    const booking = await Booking.create({
      userId,
      eventId,
      seats
    }, { transaction });
    
    // Update event booked seats
    await event.update({
      bookedSeats: event.bookedSeats + seats
    }, { transaction });
    
    await transaction.commit();
    
    // Fetch complete booking data
    const completeBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Event,
          as: 'event',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });
    
    const bookingData = completeBooking.toJSON();
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        ...bookingData,
        event: {
          ...bookingData.event,
          formattedDate: formatDate(bookingData.event.eventDate)
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({success: false,
        message: 'Server error',
        error: error.message
      });
    }
  };
  
  // @desc    Get user bookings
  // @route   GET /api/bookings/my-bookings
  // @access  Private
  exports.getMyBookings = async (req, res) => {
    try {
      const bookings = await Booking.findAll({
        where: {
          userId: req.user.id
        },
        include: [
          {
            model: Event,
            as: 'event',
            include: [
              {
                model: User,
                as: 'creator',
                attributes: ['id', 'name']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
      // Add computed fields
      const bookingsWithDetails = bookings.map(booking => {
        const bookingData = booking.toJSON();
        return {
          ...bookingData,
          event: {
            ...bookingData.event,
            status: booking.event.getStatus(),
            formattedDate: formatDate(booking.event.eventDate)
          }
        };
      });
      
      res.status(200).json({
        success: true,
        count: bookingsWithDetails.length,
        data: bookingsWithDetails
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  };
  
  // @desc    Get single booking
  // @route   GET /api/bookings/:id
  // @access  Private
  exports.getBooking = async (req, res) => {
    try {
      const booking = await Booking.findByPk(req.params.id, {
        include: [
          {
            model: Event,
            as: 'event',
            include: [
              {
                model: User,
                as: 'creator',
                attributes: ['id', 'name']
              }
            ]
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ]
      });
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }
      
      // Check ownership (user can only view their own bookings unless admin)
      if (booking.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this booking'
        });
      }
      
      const bookingData = booking.toJSON();
      
      res.status(200).json({
        success: true,
        data: {
          ...bookingData,
          event: {
            ...bookingData.event,
            status: booking.event.getStatus(),
            formattedDate: formatDate(booking.event.eventDate)
          }
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
  
  // @desc    Cancel booking
  // @route   PUT /api/bookings/:id/cancel
  // @access  Private
  exports.cancelBooking = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const booking = await Booking.findByPk(req.params.id, {
        include: [
          {
            model: Event,
            as: 'event'
          }
        ],
        lock: transaction.LOCK.UPDATE,
        transaction
      });
      
      if (!booking) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }
      
      // Check ownership
      if (booking.userId !== req.user.id) {
        await transaction.rollback();
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this booking'
        });
      }
      
      // Check if already cancelled
      if (booking.status === 'cancelled') {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Booking is already cancelled'
        });
      }
      
      // Check if event has already started
      const eventStatus = booking.event.getStatus();
      if (eventStatus === 'Ongoing' || eventStatus === 'Completed') {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Cannot cancel booking for ${eventStatus.toLowerCase()} event`
        });
      }
      
      // Update booking status
      await booking.update({
        status: 'cancelled'
      }, { transaction });
      
      // Update event booked seats
      await booking.event.update({
        bookedSeats: booking.event.bookedSeats - booking.seats
      }, { transaction });
      
      await transaction.commit();
      
      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  };
  
  // @desc    Get all bookings (Admin only)
  // @route   GET /api/bookings
  // @access  Private/Admin
  exports.getAllBookings = async (req, res) => {
    try {
      const bookings = await Booking.findAll({
        include: [
          {
            model: Event,
            as: 'event',
            include: [
              {
                model: User,
                as: 'creator',
                attributes: ['id', 'name']
              }
            ]
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
      // Add computed fields
      const bookingsWithDetails = bookings.map(booking => {
        const bookingData = booking.toJSON();
        return {
          ...bookingData,
          event: {
            ...bookingData.event,
            status: booking.event.getStatus(),
            formattedDate: formatDate(booking.event.eventDate)
          }
        };
      });
      
      res.status(200).json({
        success: true,
        count: bookingsWithDetails.length,
        data: bookingsWithDetails
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  };
  
  module.exports = exports;