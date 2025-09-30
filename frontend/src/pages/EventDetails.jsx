import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Ticket } from 'lucide-react';
import useEventStore from '../store/eventStore';
import useBookingStore from '../store/bookingStore';
import useAuthStore from '../store/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Layout from '../components/layout/Layout';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentEvent, loading, fetchEvent } = useEventStore();
  const { createBooking } = useBookingStore();
  const { isAuthenticated } = useAuthStore();
  const [seats, setSeats] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetchEvent(id);
  }, [id, fetchEvent]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }

    if (currentEvent.status !== 'Upcoming') {
      toast.error('Can only book upcoming events');
      return;
    }

    if (currentEvent.availableSeats < seats) {
      toast.error('Not enough seats available');
      return;
    }

    setIsBooking(true);
    try {
      await createBooking({ eventId: id, seats });
      toast.success('Booking successful!');
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading || !currentEvent) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-green-100 text-green-800';
      case 'Ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <button onClick={() => navigate('/events')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image */}
          {currentEvent.imageUrl ? (
            <img src={currentEvent.imageUrl} alt={currentEvent.title} className="w-full h-96 object-cover rounded-lg mb-6" />
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg mb-6 flex items-center justify-center">
              <Calendar className="w-24 h-24 text-white opacity-50" />
            </div>
          )}

          {/* Title and Status */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentEvent.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentEvent.status)}`}>
                {currentEvent.status}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Event</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{currentEvent.description}</p>
          </div>

          {/* Event Details */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Details</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Date</p>
                  <p className="text-gray-600">{currentEvent.formattedDate}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Time</p>
                  <p className="text-gray-600">
                    {currentEvent.startTime} - {currentEvent.endTime}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-gray-600">{currentEvent.location}</p>
                  <p className="text-sm text-gray-500">{currentEvent.locationType}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Capacity</p>
                  <p className="text-gray-600">
                    {currentEvent.availableSeats} seats available out of {currentEvent.capacity}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Your Tickets</h2>

            {currentEvent.status === 'Upcoming' && currentEvent.availableSeats > 0 ? (
              <>
                <div className="mb-6">
                  <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Seats (Max 2)
                  </label>
                  <select
                    id="seats"
                    value={seats}
                    onChange={(e) => setSeats(parseInt(e.target.value))}
                    className="input-field"
                  >
                    <option value={1}>1 Seat</option>
                    <option value={2}>2 Seats</option>
                  </select>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Seats:</span>
                    <span className="font-semibold">{seats}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-semibold">{currentEvent.availableSeats}</span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  {isBooking ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>Book Now</span>
                    </>
                  )}
                </button>

                {!isAuthenticated && (
                  <p className="text-xs text-gray-500 text-center mt-3">Please login to book tickets</p>
                )}
              </>
            ) : currentEvent.status === 'Completed' ? (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-2">This event has ended</p>
                <button onClick={() => navigate('/events')} className="btn-secondary">
                  Browse Other Events
                </button>
              </div>
            ) : currentEvent.availableSeats === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-2">Event is fully booked</p>
                <button onClick={() => navigate('/events')} className="btn-secondary">
                  Browse Other Events
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-2">Booking not available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetails;