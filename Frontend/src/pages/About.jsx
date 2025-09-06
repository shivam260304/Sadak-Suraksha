import React from "react";
import UserFooter from "../components/UserFooter"; // 👈 footer component

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-grow max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          <span className="font-semibold">Sadak Suraksha</span> is a
          crowdsourced platform designed to make our roads safer by reporting
          hazards like potholes, broken speed breakers, and damaged road signs in
          real-time. Unlike traditional municipal apps, our platform is
          <span className="font-semibold"> citizen-driven, transparent, and
          user-friendly</span>.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          🚀 How We Are Different
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-700">
          <li>
            <span className="font-semibold">Crowdsourced & Transparent:</span>{" "}
            Citizens can see each other’s reports, upvote issues, and build
            community-driven priority.
          </li>
          <li>
            <span className="font-semibold">Smart Categorization & Priority:</span>{" "}
            Hazards are classified (Potholes, Speed Breakers, Debris, Cracks, etc.)
            with urgency levels so authorities can act faster.
          </li>
          <li>
            <span className="font-semibold">Map-Based Reporting:</span> Pinpoint
            the exact location of road issues on an interactive map for more
            accuracy.
          </li>
          <li>
            <span className="font-semibold">Chatbot Assistance 🤖:</span> Our
            chatbot helps guide users step-by-step in reporting hazards, making it
            simple for everyone.
          </li>
          <li>
            <span className="font-semibold">Lightweight & User-Friendly:</span> A
            fast, minimal design optimized for mobile users with just 2–3 taps to
            report issues.
          </li>
          <li>
            <span className="font-semibold">Tracking & Transparency:</span> Users
            can view their reports, check status updates, and filter reports by
            category, location, or date.
          </li>
          <li>
            <span className="font-semibold">Scalable Across Cities:</span> Not
            limited to one city like BMC/AMC apps—our platform can scale to any
            municipality, highway, or even campuses.
          </li>
        </ul>

        <p className="mt-8 text-lg text-gray-700 leading-relaxed">
          Our goal is simple: <span className="font-semibold">empower citizens</span> to
          actively participate in improving road safety and ensure that hazards are
          addressed quickly and efficiently.
        </p>
      </div>

      {/* Footer */}
      <UserFooter/>
    </div>
  );
}