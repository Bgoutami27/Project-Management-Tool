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

  return (
   <div style={{ padding: "20px" }}>
      <h1
        style={{
          textAlign: "center",
          color: "#3c1053", // Deep Purple
          fontSize: "2.5rem",
          marginBottom: "30px",
          letterSpacing: "1px",
          textShadow: "2px 2px 5px rgba(60, 16, 83, 0.3)",
          fontWeight: "700",
        }}
      >
        Project Management App
      </h1>


      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />

        {/* Role-based pages */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/pm" element={<PMPage />} />
        <Route path="/developer" element={<DeveloperPage />} />

        {/* Fallback route */}
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
