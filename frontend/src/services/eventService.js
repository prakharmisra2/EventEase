import api from '../utils/api';

const eventService = {
  // Get all events with filters
  getEvents: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.locationType) params.append('locationType', filters.locationType);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.status) params.append('status', filters.status);
    
    const response = await api.get(`/events?${params.toString()}`);
    return response.data;
  },

  // Get single event
  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create event (Admin)
  createEvent: async (eventData) => {
    console.log('Creating event in service with data:', eventData);
    const response = await api.post('/events', eventData);
    console.log('Event created in service:', response.data);
    return response.data;
  },

  // Update event (Admin)
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete event (Admin)
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Get event attendees (Admin)
  getEventAttendees: async (id) => {
    const response = await api.get(`/events/${id}/attendees`);
    return response.data;
  },
};

export default eventService;