import { useState } from 'react';
import API from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // ✅ Reuse same CSS for consistent design
import registerImage from '../assets/login1.jpg'; // ✅ Same or another image from assets

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'developer',
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left side — registration form */}
        <div className="login-form-section">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="developer">Developer</option>
              <option value="project_manager">Project Manager</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit">Register</button>
          </form>

          <p className="register-text">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>

        {/* Right side — image */}
        <div className="login-image-section">
          <img
            src={registerImage}
            alt="Register Illustration"
            className="login-illustration"
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
