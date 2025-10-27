import { useState } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // import styles
import loginImage from "../assets/login1.jpg"; // ✅ Correctly import your image

function Login({ setToken, setRole }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      setToken(res.data.token);
      setRole(res.data.role);

      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "project_manager") navigate("/pm");
      else navigate("/developer");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left side - Form */}
        <div className="login-form-section">
          <h2>Log In</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
          </form>
          <p className="register-text">
            New User? <Link to="/register">Register</Link>
          </p>
        </div>

        {/* Right side - Image */}
        <div className="login-image-section">
          <img
            src={loginImage} // ✅ Use imported image variable
            alt="Login"
            className="login-illustration"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
