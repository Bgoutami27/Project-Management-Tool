const express = require("express");
const router = express.Router();
const pool = require("./db"); // Your PostgreSQL connection

// Get all projects
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a project
router.post("/", async (req, res) => {
  const { name, description, status, team } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO projects (name, description, status, team) VALUES ($1,$2,$3,$4) RETURNING *",
      [name, description, status, team]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err); // <--- Add this line
    res.status(500).json({ error: err.message });
  }
});


// Update a project
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, status, team } = req.body;
  try {
    const result = await pool.query(
      "UPDATE projects SET name=$1, description=$2, status=$3, team=$4 WHERE id=$5 RETURNING *",
      [name, description, status, team, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a project
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM projects WHERE id=$1", [id]);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
