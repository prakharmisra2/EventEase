# EventEase
EventEase is a platform where users can explore and book events such as concerts, webinars, workshops etc. 
Admins only can add new events and track seats booked attendees etc.

# Features implemented

### Public User:
* View landing page
* Explore live events
* Apply filter (category, location, date range) and customize search
* Register or sign-in

### Logged-in User:
* Explore live events
* Book events that are live
* Explore my bookings
* Booking status and confirmation details
* Cancel booking
* Calander View on my bookings

### Logged-in as Admin:
* Access admin panel
* Create, update, and/or delete events
* Booking status
* Attendees details available


# Tech Stack Used

* Frontend : React (Zustand for state management)
* Backend: Node.js + Express
* Database: PostgreSQL, sequelize
* Authentication: JWT based


### To test 
* Test Admin: 
    email: admin@gamil.com
    password: admin123

* Test User:
    email: user@gmail.com
    password: user123
    
# Setup 
#### Prerequisites
* Node.js
* PostgreSQL
* npm

### frontend
* Goto frontend folder
* setup `.env` file and define 'REACT_APP_API_URL' as your URL with suitable port number
* run  `npm install`
* run  `npm run start`



### backend
* Goto backend folder
* setup `.env` file with 
    **Note: Server Configuration** 
    PORT=Your_PORT
    NODE_ENV=development

    **Note: Database Configuration**
    DB_HOST=your_host
    DB_PORT=your_port
    DB_NAME=your_db_name
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password

    **JWT Configuration**
    JWT_SECRET=your_secret
    JWT_EXPIRE=your_time

    **CORS**
    CLIENT_URL=your_URL
* run `npm install`
* run `npm run start`