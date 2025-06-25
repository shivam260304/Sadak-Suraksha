import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Report from "./pages/Report";
import MyReports from "./pages/MyReports";




function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/report" element={<Report />} /> {/* ✅ Add this */}
        <Route path="/my-reports" element={<MyReports />} />


        {/* Add more routes here later */}
      </Routes>
    </Router>
  );
}

export default App;
