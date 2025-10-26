require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/User');

const router = express.Router();

// -------------------- REGISTER --------------------
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in DB
        const user = await createUser(name, email, hashedPassword, role);

        res.json({ message: 'User registered', user });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// -------------------- LOGIN --------------------
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get user by email
        const user = await getUserByEmail(email);
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Debug JWT_SECRET
        console.log('JWT_SECRET:', process.env.JWT_SECRET);
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT secret not configured' });
        }

        // Sign JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, role: user.role });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
