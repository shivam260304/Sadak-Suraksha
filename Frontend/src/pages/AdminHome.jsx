import { Link } from "react-router-dom";

const AdminHome = () => {

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-800 px-6 py-16 sm:px-12 md:px-20 lg:px-32">
      {/* Hero Section */}
      <section className="text-center mb-16 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-800 leading-tight">
          🚧 Sadak Suraksha - Admin
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
          Administrative dashboard to manage road hazard reports and complaints.
        </p>
        <Link to="/complaints" aria-label="Manage complaints">
          <button className="mt-8 px-8 py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-lg shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300">
            View Complaints
          </button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 max-w-6xl mx-auto text-left">
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">🗂 Manage Complaints</h2>
          <p className="text-gray-600 leading-relaxed">
            Review and assign complaints for resolution, keeping citizens informed.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold text-blue-700 mb-3">📈 Track Reports</h2>
          <p className="text-gray-600 leading-relaxed">
            Access real-time analytics and status updates on reported hazards.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-center text-sm text-gray-500 select-none">
        🇮🇳 Made with care for Indian roads by Team Sadak Suraksha
      </footer>

    </div>
  );
};

export default AdminHome;
