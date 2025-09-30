import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingCard = ({ booking, onCancel }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'Ongoing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canCancelBooking = booking.status === 'confirmed' && booking.event.status === 'Upcoming';

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await onCancel(booking.id);
        toast.success('Booking cancelled successfully');
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-primary-600"
            onClick={() => navigate(`/events/${booking.event.id}`)}
          >
            {booking.event.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventStatusColor(booking.event.status)}`}>
              {booking.event.status}
            </span>
          </div>
        </div>
        {canCancelBooking && (
          <button onClick={handleCancel} className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-primary-600" />
          <span>{booking.event.formattedDate}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-primary-600" />
          <span>
            {booking.event.startTime} - {booking.event.endTime}
          </span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-primary-600" />
          <span className="line-clamp-1">
            {booking.event.location} ({booking.event.locationType})
          </span>
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2 text-primary-600" />
          <span>{booking.seats} seat(s) booked</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button onClick={() => navigate(`/events/${booking.event.id}`)} className="w-full btn-secondary text-sm">
          View Event Details
        </button>
      </div>
    </div>
  );
};

export default BookingCard;