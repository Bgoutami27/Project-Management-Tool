import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminPage from "./pages/Admin-page";
import PMPage from "./pages/Project-manager-page";
import DeveloperPage from "./pages/DeveloperPage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("role"));
  }, []);

  // 🎨 Apply gradient background to the whole page
  useEffect(() => {
    document.body.style.background =
      "linear-gradient(135deg, #3c1053, #5f2c82, #8b5cf6)";
    document.body.style.minHeight = "100vh";
    document.body.style.margin = "0";
    document.body.style.fontFamily = "'Poppins', sans-serif";
    document.body.style.color = "#fff";
  }, []);

  const containerStyle = {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "40px",
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    boxShadow: "0 4px 25px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(10px)",
    textAlign: "center",
  };

  const headerStyle = {
    textAlign: "center",
    color: "#fdfdfd",
    fontSize: "2.8rem",
    fontWeight: "700",
    marginBottom: "10px",
    textShadow: "2px 2px 6px rgba(0, 0, 0, 0.4)",
  };

  const subTextStyle = {
    fontSize: "1.1rem",
    color: "#e0d4ff",
    marginBottom: "40px",
    letterSpacing: "0.5px",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>🚀 Project Management App</h1>
      <p style={subTextStyle}>
        Organize projects, assign tasks, and collaborate efficiently.
      </p>

      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Authentication */}
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={<Login setToken={setToken} setRole={setRole} />}
        />

        {/* Role-based Pages */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/pm" element={<PMPage />} />
        <Route path="/developer" element={<DeveloperPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
