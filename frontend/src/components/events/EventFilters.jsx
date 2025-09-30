import React from 'react';
import { Filter, X } from 'lucide-react';

const EventFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const categories = ['Music', 'Tech', 'Business', 'Sports', 'Arts', 'Education', 'Other'];
  const locationTypes = ['Online', 'In-Person'];
  const statuses = ['Upcoming', 'Ongoing', 'Completed'];

  const hasActiveFilters = Object.values(filters).some((value) => value !== '');

  return (
    <div className="card mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button onClick={onClearFilters} className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1">
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={onFilterChange}
            className="input-field text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
          <select
            name="locationType"
            value={filters.locationType}
            onChange={onFilterChange}
            className="input-field text-sm"
          >
            <option value="">All Types</option>
            {locationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={onFilterChange}
            className="input-field text-sm"
          >
            <option value="">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={onFilterChange}
            className="input-field text-sm"
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={onFilterChange}
            className="input-field text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default EventFilters;