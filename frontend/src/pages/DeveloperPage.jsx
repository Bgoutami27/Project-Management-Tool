import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DeveloperPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [comment, setComment] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch tasks assigned to developer
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          "https://project-management-tool-tuns.onrender.com/api/tasks/developer",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, [token, navigate]);

  // Update task status
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasks.find((t) => t.id === taskId);
      if (!taskToUpdate) return;

      const updatedTask = { ...taskToUpdate, status: newStatus };

      await axios.put(
        `https://project-management-tool-tuns.onrender.com/api/tasks/${taskId}`,
        updatedTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Add comment to task
  const handleAddComment = async () => {
    if (!selectedTaskId || !comment) return;
    try {
      await axios.post(
        `https://project-management-tool-tuns.onrender.com/api/tasks/${selectedTaskId}/comment`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Comment added!");
      setComment("");
      setSelectedTaskId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // ---------- STYLES ----------
  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(120deg, #a2d2ff, #cdb4db)",
      fontFamily: "'Poppins', sans-serif",
      padding: "30px",
    },
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      backgroundColor: "#4b0082",
      color: "white",
      borderRadius: "10px",
      boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
      marginBottom: "30px",
    },
    logoutBtn: {
      padding: "8px 16px",
      backgroundColor: "#e74c3c",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
      transition: "background 0.3s",
    },
    card: {
      backgroundColor: "#ffffffdd",
      borderRadius: "15px",
      padding: "25px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
      margin: "0 auto",
      maxWidth: "1000px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      backgroundColor: "white",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    },
    th: {
      backgroundColor: "#6a0dad",
      color: "white",
      padding: "12px",
      textAlign: "left",
      fontWeight: "600",
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #eee",
    },
    input: {
      padding: "8px",
      width: "70%",
      borderRadius: "6px",
      border: "1px solid #bbb",
      marginRight: "6px",
      fontSize: "14px",
    },
    addBtn: {
      padding: "8px 12px",
      backgroundColor: "#27ae60",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background 0.3s",
    },
    select: {
      padding: "8px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
      backgroundColor: "white",
    },
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h2>👨‍💻 Developer Dashboard</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Task Section */}
      <div style={styles.card}>
        <h3 style={{ color: "#4b0082", marginBottom: "15px" }}>
          Tasks Assigned to You
        </h3>

        {tasks.length === 0 ? (
          <p>No tasks assigned yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Task</th>
                <th style={styles.th}>Deadline</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Update Status</th>
                <th style={styles.th}>Add Comment</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td style={styles.td}>{task.title}</td>

                  {/* ✅ Deadline column with red color if overdue */}
                  <td
                    style={{
                      ...styles.td,
                      color:
                        new Date(task.deadline) < new Date() ? "red" : "#333",
                      fontWeight: "500",
                    }}
                  >
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString()
                      : "—"}
                  </td>

                  <td style={styles.td}>{task.status}</td>

                  <td style={styles.td}>
                    <select
                      style={styles.select}
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>

                  <td style={styles.td}>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Add comment"
                      value={selectedTaskId === task.id ? comment : ""}
                      onChange={(e) => {
                        setSelectedTaskId(task.id);
                        setComment(e.target.value);
                      }}
                    />
                    <button
                      style={styles.addBtn}
                      onClick={handleAddComment}
                      disabled={selectedTaskId !== task.id || !comment}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DeveloperPage;
