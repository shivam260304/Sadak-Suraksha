// src/pages/Home.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ChatPopup from '../components/ChatPopup';

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800 px-4 py-10">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800">
          🚧 Sadak Suraksha
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
          A crowdsourced platform for citizens to report potholes and road hazards in real-time.
        </p>
        <Link to="/report">
          <button className="mt-6 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded shadow">
            Report a Hazard
          </button>
        </Link>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-700">🛣️ Report Hazards</h2>
          <p className="mt-2 text-gray-600">
            Quickly log road issues with description, severity, and location.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-700">📍 Live Location Tracking</h2>
          <p className="mt-2 text-gray-600">
            View and submit location-based reports using the integrated map.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-700">🚀 Real-Time Updates</h2>
          <p className="mt-2 text-gray-600">
            Authorities and users get instant updates on newly reported issues.
          </p>
        </div>
      </section>

      {/* Footer Note */}
      <footer className="mt-16 text-center text-sm text-gray-500">
        🇮🇳 Made with care for Indian roads by Team Sadak Suraksha
      </footer>

      {/* Chat Icon Button - Fixed position */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed left-5 bottom-5 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-all duration-300 hover:scale-110"
        aria-label="Open chat support"
      >
        💬
      </button>

      {/* Chat Popup Component */}
      <ChatPopup 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
};

export default Home;
