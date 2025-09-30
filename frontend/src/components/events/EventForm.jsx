import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const EventForm = ({ event, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Tech',
    location: '',
    locationType: 'Online',
    eventDate: '',
    startTime: '',
    endTime: '',
    capacity: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        category: event.category || 'Tech',
        location: event.location || '',
        locationType: event.locationType || 'Online',
        eventDate: event.eventDate || '',
startTime: event.startTime || '',
endTime: event.endTime || '',
capacity: event.capacity || '',
imageUrl: event.imageUrl || '',
});
}
}, [event]);
const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};
const handleSubmit = (e) => {
e.preventDefault();
onSubmit(formData);
};
const categories = ['Music', 'Tech', 'Business', 'Sports', 'Arts', 'Education', 'Other'];
const locationTypes = ['Online', 'In-Person'];
return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
<h2 className="text-2xl font-bold text-gray-900">
{event ? 'Edit Event' : 'Create New Event'}
</h2>
<button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
<X className="w-6 h-6" />
</button>
</div>
<form onSubmit={handleSubmit} className="p-6 space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="input-field"
          required
        />
      </div>

      {/* Category and Location Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location Type *
          </label>
          <select
            name="locationType"
            value={formData.locationType}
            onChange={handleChange}
            className="input-field"
            required
          >
            {locationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location *
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Convention Center or Zoom Meeting"
          className="input-field"
          required
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Date *
        </label>
        <input
          type="date"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      {/* Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time *
          </label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time *
          </label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
      </div>

      {/* Capacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Capacity *
        </label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          min="1"
          className="input-field"
          required
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image URL (Optional)
        </label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="input-field"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary flex items-center space-x-2" disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              <span>{event ? 'Updating...' : 'Creating...'}</span>
            </>
          ) : (
            <span>{event ? 'Update Event' : 'Create Event'}</span>
          )}
        </button>
      </div>
    </form>
  </div>
</div>
);
};
export default EventForm;