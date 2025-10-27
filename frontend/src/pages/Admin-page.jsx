import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function AdminPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    team: "",
  });

  // Fetch data
  const fetchProjects = async () => {
    const res = await axios.get(
      "https://project-management-tool-tuns.onrender.com/api/projects"
    );
    setProjects(res.data);
  };

  const fetchTasks = async () => {
    const res = await axios.get(
      "https://project-management-tool-tuns.onrender.com/api/tasks"
    );
    setTasks(res.data);
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Project CRUD
  const addProject = async () => {
    const res = await axios.post(
      "https://project-management-tool-tuns.onrender.com/api/projects",
      newProject
    );
    setProjects([...projects, res.data]);
    setNewProject({ name: "", description: "", team: "" });
  };

  const deleteProject = async (id) => {
    await axios.delete(
      `https://project-management-tool-tuns.onrender.com/api/projects/${id}`
    );
    setProjects(projects.filter((p) => p.id !== id));
  };

  // Task analytics
  const taskCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const overdueTasks = tasks.filter(
    (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== "Done"
  );

  // ---------- Styles ----------
  const styles = {
    container: {
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
      background: "linear-gradient(135deg, #3c1053, #ad5389)",
      color: "#fff",
      borderRadius: "14px",
      boxShadow: "0 4px 14px rgba(60, 16, 83, 0.3)",
      marginBottom: "30px",
    },
    logoutBtn: {
      background: "#e74c3c",
      border: "none",
      padding: "10px 18px",
      color: "white",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "0.3s",
    },
    sectionTitle: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#4b0082",
      marginBottom: "15px",
    },
    card: {
      background: "rgba(255, 255, 255, 0.9)",
      borderRadius: "16px",
      padding: "25px",
      marginBottom: "30px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
      backdropFilter: "blur(10px)",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      marginBottom: "12px",
      fontSize: "15px",
    },
    addBtn: {
      padding: "10px 18px",
      background: "linear-gradient(135deg, #6043b4, #a05d85)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "0.3s",
    },
    projectList: {
      listStyle: "none",
      padding: "0",
      marginTop: "15px",
    },
    projectItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#f3eaff",
      padding: "12px 16px",
      borderRadius: "12px",
      marginBottom: "10px",
      fontSize: "15px",
      boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
    },
    deleteBtn: {
      background: "#ff4b4b",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "6px 12px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "0.3s",
    },
    statsCard: {
      background: "#ffffffee",
      borderRadius: "15px",
      padding: "20px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "20px",
      marginBottom: "20px",
    },
    statBox: {
      background: "linear-gradient(135deg, #a06cd5, #b892ff)",
      color: "white",
      borderRadius: "10px",
      padding: "20px",
      textAlign: "center",
      fontWeight: "600",
      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    },
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h2>🛠 Admin Dashboard</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Project Section */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>📁 Project Management</h3>
        <input
          style={styles.input}
          placeholder="Project Name"
          value={newProject.name}
          onChange={(e) =>
            setNewProject({ ...newProject, name: e.target.value })
          }
        />
        <input
          style={styles.input}
          placeholder="Description"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
        />
        <input
          style={styles.input}
          placeholder="Team"
          value={newProject.team}
          onChange={(e) =>
            setNewProject({ ...newProject, team: e.target.value })
          }
        />
        <button style={styles.addBtn} onClick={addProject}>
          ➕ Add Project
        </button>

        <ul style={styles.projectList}>
          {projects.map((p) => (
            <li key={p.id} style={styles.projectItem}>
              <span>
                <strong>{p.name}</strong> — Team: {p.team}
              </span>
              <button
                style={styles.deleteBtn}
                onClick={() => deleteProject(p.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Task Summary */}
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>📊 Task Summary</h3>
        <div style={styles.statsCard}>
          <div style={styles.statBox}>To Do: {taskCounts["To Do"] || 0}</div>
          <div style={styles.statBox}>
            In Progress: {taskCounts["In Progress"] || 0}
          </div>
          <div style={styles.statBox}>Done: {taskCounts["Done"] || 0}</div>
          <div style={styles.statBox}>Overdue: {overdueTasks.length}</div>
        </div>

        <h3 style={styles.sectionTitle}>🧾 Task List</h3>
        <ul style={styles.projectList}>
          {tasks.map((t) => (
            <li key={t.id} style={styles.projectItem}>
              <span>
                <strong>{t.title}</strong> — {t.status}{" "}
                {t.assigned_user && `| 👤 ${t.assigned_user}`}{" "}
                {t.due_date && `| 📅 ${new Date(t.due_date).toLocaleDateString()}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPage;
