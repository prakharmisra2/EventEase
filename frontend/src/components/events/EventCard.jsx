import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

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
    }};
    const getCategoryColor = (category) => {
        const colors = {
        Music: 'bg-purple-100 text-purple-800',
        Tech: 'bg-blue-100 text-blue-800',
        Business: 'bg-green-100 text-green-800',
        Sports: 'bg-red-100 text-red-800',
        Arts: 'bg-pink-100 text-pink-800',
        Education: 'bg-yellow-100 text-yellow-800',
        Other: 'bg-gray-100 text-gray-800',
        };
        return colors[category] || colors.Other;
        };
        return (
            <div
            className="card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/events/${event.id}`)}

            >
            {/* Image */}
            {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover rounded-t-lg -mt-6 -mx-6 mb-4" />
            ) : (
            <div className="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600 rounded-t-lg -mt-6 -mx-6 mb-4 flex items-center justify-center">
            <Calendar className="w-16 h-16 text-white opacity-50" />
            </div>
            )}
            {/* Badges */}
  <div className="flex items-center gap-2 mb-3">
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
      {event.status}
    </span>
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
      {event.category}
    </span>
  </div>

  {/* Title */}
  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>

  {/* Description */}
  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

  {/* Details */}
  <div className="space-y-2 text-sm text-gray-600">
    <div className="flex items-center">
      <Calendar className="w-4 h-4 mr-2 text-primary-600" />
      <span>{event.formattedDate}</span>
    </div>
    <div className="flex items-center">
      <Clock className="w-4 h-4 mr-2 text-primary-600" />
      <span>
        {event.startTime} - {event.endTime}
      </span>
    </div>
    <div className="flex items-center">
      <MapPin className="w-4 h-4 mr-2 text-primary-600" />
      <span className="line-clamp-1">
        {event.location} ({event.locationType})
      </span>
    </div>
    <div className="flex items-center">
      <Users className="w-4 h-4 mr-2 text-primary-600" />
      <span>
        {event.availableSeats} / {event.capacity} seats available
      </span>
    </div>
  </div>

  {/* CTA */}
  <div className="mt-4 pt-4 border-t border-gray-200">
    <button className="w-full btn-primary text-sm">View Details</button>
  </div>
</div>
);
};
export default EventCard;
