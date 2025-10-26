require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import route files
const authRoutes = require('./routes/auth');
const projectRoutes = require("./projects");
const taskRoutes = require('./routes/tasks');
const usersRouter = require('./routes/users');

const app = express();

// -------------------- MIDDLEWARE --------------------
// Parse JSON bodies first
app.use(express.json());

// Enable CORS only for your frontend URL
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g. 'https://project-management-frontend.onrender.com'
  credentials: true
}));

// -------------------- ROUTES --------------------
app.use('/api/auth', authRoutes); // authentication routes
app.use('/api/users', usersRouter); // admin-only user management
app.use('/api/projects', projectRoutes); // project routes
app.use('/api/tasks', taskRoutes); // task routes

// -------------------- HEALTH CHECK --------------------
app.get('/healthz', (req, res) => res.send('OK'));

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 5000; // Render provides PORT dynamically
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});
