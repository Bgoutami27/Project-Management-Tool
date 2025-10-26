const express = require("express");
const router = express.Router();
const pool = require("../db"); // PostgreSQL connection
const { authenticateToken } = require("../middleware/auth");

/* =========================================================
   🧩 ADMIN ROUTES
   ========================================================= */

// ✅ Get all tasks (Admin can view all)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT tasks.*, users.name AS assigned_user 
       FROM tasks 
       LEFT JOIN users ON tasks.assigned_to = users.id 
       ORDER BY tasks.id ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get tasks by specific user (used for PM/Developer view)
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT tasks.*, users.name AS assigned_user 
       FROM tasks 
       LEFT JOIN users ON tasks.assigned_to = users.id 
       WHERE tasks.assigned_to = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user tasks:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create a new task
router.post("/", async (req, res) => {
  const { title, description, status, assigned_to, deadline } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status, assigned_to, deadline)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, status, assigned_to || null, deadline || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error creating task:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update an existing task
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, status, assigned_to, deadline } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tasks 
       SET title = $1, description = $2, status = $3, assigned_to = $4, deadline = $5 
       WHERE id = $6 
       RETURNING *`,
      [title, description, status, assigned_to || null, deadline || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating task:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a task
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =========================================================
   🧩 DEVELOPER ROUTES
   ========================================================= */

// ✅ Get tasks assigned to the logged-in developer
router.get("/developer", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT tasks.*, users.name AS assigned_user, projects.name AS project_name
       FROM tasks
       LEFT JOIN users ON tasks.assigned_to = users.id
       LEFT JOIN projects ON tasks.project_id = projects.id
       WHERE tasks.assigned_to = $1
       ORDER BY tasks.id DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching developer tasks:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ Update task status (Developer can only change their assigned tasks)
router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      "UPDATE tasks SET status = $1 WHERE id = $2 AND assigned_to = $3 RETURNING *",
      [status, id, userId]
    );

    if (result.rowCount === 0)
      return res.status(403).json({ error: "Not authorized or task not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating task status:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Add a comment to a task (Developer)
router.post("/:id/comment", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    // Create comments table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        comment TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const result = await pool.query(
      "INSERT INTO comments (task_id, user_id, comment) VALUES ($1, $2, $3) RETURNING *",
      [id, userId, comment]
    );

    res.json({ message: "Comment added successfully", comment: result.rows[0] });
  } catch (err) {
    console.error("Error adding comment:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
