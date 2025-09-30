import { create } from 'zustand';
import bookingService from '../services/bookingService';

const useBookingStore = create((set) => ({
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,

  fetchMyBookings: async () => {
    set({ loading: true, error: null });
    try {
      const data = await bookingService.getMyBookings();
      set({ bookings: data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch bookings', loading: false });
    }
  },

  fetchBooking: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await bookingService.getBooking(id);
      set({ currentBooking: data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch booking', loading: false });
    }
  },

  createBooking: async (bookingData) => {
    set({ loading: true, error: null });
    try {
      const data = await bookingService.createBooking(bookingData);
      set((state) => ({ bookings: [...state.bookings, data.data], loading: false }));
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create booking', loading: false });
      throw error;
    }
  },

  cancelBooking: async (id) => {
    set({ loading: true, error: null });
    try {
      await bookingService.cancelBooking(id);
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking.id === id ? { ...booking, status: 'cancelled' } : booking
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to cancel booking', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useBookingStore;