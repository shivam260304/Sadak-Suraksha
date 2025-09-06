import React, { useState } from "react";
import { Link } from "react-router-dom";
import ChatPopup from "../components/ChatPopup";
import UserFooter from "../components/UserFooter";

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800 px-6 py-16 sm:px-12 md:px-20 lg:px-32">
      {/* Hero Section */}
      <section className="text-center mb-16 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-800 leading-tight">
          🚧 Sadak Suraksha
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
          A crowdsourced platform for citizens to report potholes and road hazards in real-time.
        </p>
        <div className="flex justify-center gap-6 mt-8">
          <Link to="/report" aria-label="Report a hazard">
            <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-lg shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300">
              Report a Hazard
            </button>
          </Link>
          <Link to="/city-overview" aria-label="City overview">
            <button className="px-8 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300">
              City Overview
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 max-w-6xl mx-auto text-left">
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">🛣️ Report Hazards</h2>
          <p className="text-gray-600 leading-relaxed">
            Quickly log road issues with description, severity, and location.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">🚀 Real-Time Updates</h2>
          <p className="text-gray-600 leading-relaxed">
            Authorities and users get instant updates on newly reported issues.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-center text-sm text-gray-500 select-none">
        🇮🇳 Made with care for Indian roads by Team Sadak Suraksha
      </footer>

      {/* Chat Icon Button - Fixed position */}
      <button
        onClick={() => setIsChatOpen(true)}
        aria-label="Open chat support"
        className="fixed left-6 bottom-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        💬
      </button>

      {/* Chat Popup Component */}
      <ChatPopup isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <UserFooter />
    </div>
  );
};

export default Home;
