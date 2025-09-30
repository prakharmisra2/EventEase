const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { generateEventId } = require('../utils/eventIdGenerator');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Music', 'Tech', 'Business', 'Sports', 'Arts', 'Education', 'Other'),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  locationType: {
    type: DataTypes.ENUM('Online', 'In-Person'),
    allowNull: false
  },
  eventDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  bookedSeats: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'events',
  timestamps: true,
  hooks: {
    beforeCreate: async (event) => {
      event.eventId = generateEventId(event.eventDate);
    }
  }
});

// Virtual field for event status
Event.prototype.getStatus = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const eventDate = new Date(this.eventDate);
  eventDate.setHours(0, 0, 0, 0);
  
  if (eventDate > today) {
    return 'Upcoming';
  } else if (eventDate.getTime() === today.getTime()) {
    return 'Ongoing';
  } else {
    return 'Completed';
  }
};

// Virtual field for available seats
Event.prototype.getAvailableSeats = function() {
  return this.capacity - this.bookedSeats;
};

module.exports = Event;