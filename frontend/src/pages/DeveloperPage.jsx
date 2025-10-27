import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // ---------- STYLES ----------
  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(120deg, #3c1053, #ad5389)",
      padding: "40px 20px",
      fontFamily: "'Poppins', sans-serif",
      color: "#333",
    },
    container: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: "15px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      padding: "30px",
      maxWidth: "1100px",
      margin: "auto",
    },
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#3c1053",
      color: "white",
      padding: "15px 30px",
      borderRadius: "10px",
      marginBottom: "30px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    },
    navLink: {
      color: "white",
      textDecoration: "none",
      fontWeight: "600",
      marginRight: "15px",
    },
    logoutBtn: {
      backgroundColor: "#e74c3c",
      color: "white",
      padding: "8px 15px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "0.3s",
    },
    heading: {
      color: "#3c1053",
      textAlign: "center",
      marginBottom: "25px",
      fontSize: "24px",
      fontWeight: "700",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },
    th: {
      backgroundColor: "#6a1b9a",
      color: "white",
      padding: "12px",
      textAlign: "left",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
      backgroundColor: "#fff",
    },
    select: {
      padding: "6px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    input: {
      padding: "6px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      width: "70%",
      marginRight: "8px",
    },
    addBtn: {
      padding: "6px 10px",
      backgroundColor: "#27ae60",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    noTask: {
      textAlign: "center",
      fontSize: "16px",
      color: "#555",
      marginTop: "20px",
    },
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h2>Developer Dashboard</h2>
        <div>
          <Link to="/developer" style={styles.navLink}>
            Dashboard
          </Link>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div style={styles.container}>
        <h3 style={styles.heading}>Tasks Assigned to You</h3>

        {tasks.length === 0 ? (
          <p style={styles.noTask}>No tasks assigned yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Task</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Update Status</th>
                <th style={styles.th}>Add Comment</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td style={styles.td}>{task.title}</td>
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
