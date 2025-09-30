const format = require('date-fns/format');

const formatDate = (date) => {
  // Format: DD-MMM-YYYY (e.g., 30-Jul-2025)
  return format(new Date(date), 'dd-MMM-yyyy');
};

const formatDateTime = (date) => {
  return format(new Date(date), 'dd-MMM-yyyy HH:mm');
};

module.exports = { formatDate, formatDateTime };