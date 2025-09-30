const generateEventId = (eventDate) => {
    const date = new Date(eventDate);
    
    // Get month abbreviation (JAN, FEB, etc.)
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[date.getMonth()];
    
    // Get year
    const year = date.getFullYear();
    
    // Generate 3 random alphanumeric characters
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let random = '';
    for (let i = 0; i < 3; i++) {
      random += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return `EVT-${month}${year}-${random}`;
  };
  
  module.exports = { generateEventId };