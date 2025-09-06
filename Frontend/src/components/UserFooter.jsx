import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";

const UserFooter = () => {
  return (
    <footer className="bg-blue-900 text-gray-200 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        
        {/* About */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">🚧 Sadak Suraksha</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            A crowdsourced platform for reporting potholes and road hazards in real-time.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/report" className="hover:text-orange-400">Make A Report</Link></li>
            <li><Link to="/my-reports" className="hover:text-orange-400">My Reports</Link></li>
            <li><Link to="/city-overview" className="hover:text-orange-400">City Overview</Link></li>
            <li><Link to="/aboutus" className="hover:text-orange-400">About us</Link></li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Contact</h3>
          <p className="text-sm text-gray-300">Email: hppdeepseek10@gmail.com</p>
          <p className="text-sm text-gray-300 mb-4">📍 India</p>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="https://github.com/shivam260304/Sadak-Suraksha" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/shivamrajput263/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400">
              <Linkedin size={20} />
            </a>
            {/* <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400">
              <Twitter size={20} />
            </a> */}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        🇮🇳 Made with care for Indian roads by Team Sadak Suraksha © {new Date().getFullYear()}
      </div>
    </footer>
  );
};

export default UserFooter;