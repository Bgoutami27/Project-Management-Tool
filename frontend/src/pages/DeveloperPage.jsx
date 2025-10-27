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
        const res = await axios.get("https://project-management-tool-tuns.onrender.com/api/tasks/developer", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, [token, navigate]);

  const handleStatusChange = async (taskId, newStatus) => {
  try {
    // Find the task in the state
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, status: newStatus };

    await axios.put(
      `https://project-management-tool-tuns.onrender.com/api/tasks/${taskId}`,
      updatedTask,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update local state
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
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
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 30px",
      backgroundColor: "#2c3e50",
      color: "white",
      borderRadius: "8px",
      marginBottom: "25px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    },
    navLink: {
      marginRight: "15px",
      color: "white",
      textDecoration: "none",
      fontWeight: "bold",
    },
    logoutBtn: {
      padding: "6px 14px",
      backgroundColor: "#e74c3c",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
    },
    tableWrapper: {
      overflowX: "auto",
      padding: "0 30px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    th: {
      backgroundColor: "#34495e",
      color: "white",
      padding: "12px",
      textAlign: "left",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
    },
    input: {
      padding: "6px",
      width: "75%",
      borderRadius: "4px",
      border: "1px solid #ccc",
      marginRight: "6px",
    },
    addBtn: {
      padding: "6px 10px",
      backgroundColor: "#27ae60",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    select: {
      padding: "6px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
  };

  return (
    <div>
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

      {/* Task Section */}
      <div style={styles.tableWrapper}>
        <h3>Tasks Assigned to You</h3>
        {tasks.length === 0 ? (
          <p>No tasks assigned yet.</p>
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
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
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
