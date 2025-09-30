import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Users, Calendar } from 'lucide-react';
import useEventStore from '../store/eventStore';
//import useAuthStore from '../store/authStore';
import EventForm from '../components/events/EventForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Layout from '../components/layout/Layout';
import toast from 'react-hot-toast';
import eventService from '../services/eventService';

const AdminDashboard = () => {
  //const { user } = useAuthStore();
  const { events, loading, fetchEvents, createEvent, updateEvent, deleteEvent } = useEventStore();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateEvent = async (eventData) => {
    console.log('Creating event with data:', eventData);
    try {
      await createEvent(eventData);
      toast.success('Event created successfully');
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      await updateEvent(editingEvent.id, eventData);
      toast.success('Event updated successfully');
      setShowForm(false);
      setEditingEvent(null);
    } catch (error) {
      toast.error('Failed to update event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        toast.success('Event deleted successfully');
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleViewAttendees = async (event) => {
    setSelectedEvent(event);
    setLoadingAttendees(true);
    try {
      const data = await eventService.getEventAttendees(event.id);
      setAttendees(data.data);
    } catch (error) {
      toast.error('Failed to load attendees');
    } finally {
      setLoadingAttendees(false);
    }
  };

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your events and view analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
            <Calendar className="w-10 h-10 text-primary-600 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Upcoming</p>
              <p className="text-2xl font-bold text-green-600">
                {events.filter((e) => e.status === 'Upcoming').length}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Ongoing</p>
              <p className="text-2xl font-bold text-blue-600">
                {events.filter((e) => e.status === 'Ongoing').length}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-gray-600">
                {events.filter((e) => e.status === 'Completed').length}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-gray-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Create Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            setEditingEvent(null);
            setShowForm(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Events Table */}
      <div className="card overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Events</h2>

        {loading ? (
          <LoadingSpinner />
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No events created yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Event ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Title</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Capacity</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Booked</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{event.eventId}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.category}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{event.formattedDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{event.capacity}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{event.bookedSeats}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewAttendees(event)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Attendees"
                      >
                        <Users className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(event)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                        title="Edit Event"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <EventForm
          event={editingEvent}
          onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          onCancel={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
          loading={loading}
        />
      )}

      {/* Attendees Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Event Attendees</h2>
              <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-600">
                {/* <X className="w-6 h-6" /> */}
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-lg text-gray-900">{selectedEvent.title}</h3>
                <p className="text-sm text-gray-600">{selectedEvent.formattedDate}</p>
              </div>

              {loadingAttendees ? (
                <LoadingSpinner />
              ) : attendees.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No attendees yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {attendees.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{booking.user.name}</p>
                        <p className="text-sm text-gray-600">{booking.user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{booking.seats} seat(s)</p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Attendees:</span>
                  <span className="text-lg font-bold text-primary-600">{attendees.length}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium text-gray-700">Total Seats Booked:</span>
                  <span className="text-lg font-bold text-primary-600">
                    {attendees.reduce((sum, booking) => sum + booking.seats, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;