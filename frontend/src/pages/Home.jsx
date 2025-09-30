import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Ticket, Search, Shield, Zap } from 'lucide-react';
import Layout from '../components/layout/Layout';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search className="w-8 h-8 text-primary-600" />,
      title: 'Discover Events',
      description: 'Browse through a wide variety of events tailored to your interests',
    },
    {
      icon: <Ticket className="w-8 h-8 text-primary-600" />,
      title: 'Easy Booking',
      description: 'Book tickets instantly with just a few clicks',
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Manage Bookings',
      description: 'View and manage all your bookings in one place',
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: 'Secure & Reliable',
      description: 'Your data is safe with our secure platform',
    },
    {
      icon: <Zap className="w-8 h-8 text-primary-600" />,
      title: 'Real-time Updates',
      description: 'Get instant confirmation and updates on your bookings',
    },
    {
      icon: <Calendar className="w-8 h-8 text-primary-600" />,
      title: 'Calendar View',
      description: 'Organize your events with our intuitive calendar interface',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-8 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover Amazing Events
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Your one-stop platform for finding, booking, and managing events. From concerts to conferences, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/events')}
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Events
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors border-2 border-white"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose EventEase?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We make event booking simple, secure, and hassle-free
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="card bg-gradient-to-r from-primary-50 to-primary-100 text-center">
        <Calendar className="w-16 h-16 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Ready to Start Exploring?
        </h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Join thousands of users who trust EventEase for their event booking needs
        </p>
        <button
          onClick={() => navigate('/events')}
          className="btn-primary text-lg px-8 py-3"
        >
          Explore Events Now
        </button>
      </div>
    </Layout>
  );
};

export default Home;