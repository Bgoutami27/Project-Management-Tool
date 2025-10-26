require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const app = express();
const projectRoutes = require("./projects");
const taskRoutes = require('./routes/tasks');
const usersRouter = require("./routes/users");
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g. 'https://project-management-frontend.onrender.com'
  credentials: true
}));
app.use("/api/users", usersRouter);
app.use(express.json());
app.use("/api/projects", projectRoutes);

app.use('/api/auth', authRoutes); // Admin only
app.use('/api/tasks', taskRoutes);    
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
