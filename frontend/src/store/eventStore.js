import { create } from 'zustand';
import eventService from '../services/eventService';

const useEventStore = create((set) => ({
  events: [],
  currentEvent: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    locationType: '',
    startDate: '',
    endDate: '',
    status: '',
  },

  setFilters: (filters) => set({ filters }),

  fetchEvents: async (filters) => {
    set({ loading: true, error: null });
    try {
      const data = await eventService.getEvents(filters);
      set({ events: data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch events', loading: false });
    }
  },

  fetchEvent: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await eventService.getEvent(id);
      set({ currentEvent: data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch event', loading: false });
    }
  },

  createEvent: async (eventData) => {
    set({ loading: true, error: null });
    try {
        console.log('Creating event with data:', eventData);
      const data = await eventService.createEvent(eventData);
      console.log('Event created:', data);
      set((state) => ({ events: [...state.events, data.data], loading: false }));
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create event', loading: false });
      throw error;
    }
  },

  updateEvent: async (id, eventData) => {
    set({ loading: true, error: null });
    try {
      const data = await eventService.updateEvent(id, eventData);
      set((state) => ({
        events: state.events.map((event) => (event.id === id ? data.data : event)),
        loading: false,
      }));
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update event', loading: false });
      throw error;
    }
  },

  deleteEvent: async (id) => {
    set({ loading: true, error: null });
    try {
      await eventService.deleteEvent(id);
      set((state) => ({
        events: state.events.filter((event) => event.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete event', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useEventStore;