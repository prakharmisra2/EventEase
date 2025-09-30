import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import useEventStore from '../store/eventStore';
import EventCard from '../components/events/EventCard';
import EventFilters from '../components/events/EventFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Layout from '../components/layout/Layout';

const Events = () => {
  const { events, loading, fetchEvents } = useEventStore();
  const [filters, setFilters] = useState({
    category: '',
    locationType: '',
    startDate: '',
    endDate: '',
    status: '',
  });

  useEffect(() => {
    fetchEvents(filters);
  }, [filters, fetchEvents]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      locationType: '',
      startDate: '',
      endDate: '',
      status: '',
    });
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Events</h1>
        <p className="text-gray-600">Find and book amazing events near you</p>
      </div>

      <EventFilters filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />

      {loading ? (
        <LoadingSpinner />
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Showing {events.length} event{events.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
};

export default Events;