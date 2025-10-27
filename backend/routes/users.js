const express = require("express");
const router = express.Router();
const pool = require("../db"); // PostgreSQL connection

// ✅ Get only developer users (for assigning tasks)
router.get("/developers", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE LOWER(role) = 'developer' ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching developers:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
