import React from 'react';
import { Calendar } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Calendar className="w-5 h-5" />
            <span className="font-bold text-lg">EventEase</span>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} EventEase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;