import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Report from "./pages/Report";
import MyReports from "./pages/MyReports";
import { AuthProvider } from "./components/AuthContext";
import AdminHome from "./pages/AdminHome";

const Complaints = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6">
    <h1 className="text-3xl font-bold mb-4">Complaints Page (Coming Soon)</h1>
  </div>
);
const SolvesComplaints = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6">
    <h1 className="text-3xl font-bold mb-4">Solves Complaints Page (Coming Soon)</h1>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/report" element={<Report />} />
          <Route path="/my-reports" element={<MyReports />} />

          {/* Admin routes */}
          <Route path="/admin-home" element={<AdminHome />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/solves-complaints" element={<SolvesComplaints />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
