import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function AdminPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [newProject, setNewProject] = useState({ name: "", description: "", status: "", team: "" });

  // Fetch projects and tasks
  const fetchProjects = async () => {
    const res = await axios.get("https://project-management-tool-tuns.onrender.com/api/projects");
    setProjects(res.data);
  };

  const fetchTasks = async () => {
    const res = await axios.get("https://project-management-tool-tuns.onrender.com/api/tasks");
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

  // ----------- Project CRUD -----------
  const addProject = async () => {
    const res = await axios.post("https://project-management-tool-tuns.onrender.com/api/projects", newProject);
    setProjects([...projects, res.data]);
    setNewProject({ name: "", description: "", status: "", team: "" });
  };

  const deleteProject = async (id) => {
    await axios.delete(`https://project-management-tool-tuns.onrender.com/api/projects/${id}`);
    setProjects(projects.filter(p => p.id !== id));
  };

  const updateProject = async (id, updatedProject) => {
    const res = await axios.put(`https://project-management-tool-tuns.onrender.com/api/projects/${id}`, updatedProject);
    setProjects(projects.map(p => (p.id === id ? res.data : p)));
  };

  // ----------- Reporting Logic -----------
  const taskCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const overdueTasks = tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== "Done");

  // ----------------- Styles -----------------
  // ----------------- Updated Styles -----------------
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
    background: "#f9f9fb",
    minHeight: "100vh",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#6c5ce7",
    color: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: "30px",
  },
  button: {
    padding: "8px 15px",
    marginRight: "5px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.2s",
  },
  card: {
    flex: "1 1 400px",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    color: "#2d3436",
    marginBottom: "25px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
    transition: "border 0.2s",
  },
  inputFocus: {
    border: "1px solid #6c5ce7",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#6c5ce7",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginTop: "20px",
    marginBottom: "15px",
    color: "#2d3436",
  },
  projectList: {
    listStyle: "none",
    padding: "0",
  },
  projectItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 10px",
    marginBottom: "8px",
    backgroundColor: "#f1f2f6",
    borderRadius: "6px",
  },
  taskList: {
    listStyle: "none",
    padding: "0",
  },
  taskItem: {
    padding: "8px 10px",
    marginBottom: "8px",
    backgroundColor: "#dfe6e9",
    borderRadius: "6px",
  },
};

  return (
    <div>
      <nav style={styles.navbar}>
        <h2>Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{ ...styles.button, backgroundColor: "#e74c3c", color: "white" }}
        >
          Logout
        </button>
      </nav>

      <div style={{ padding: "0 30px" }}>
        {/* ---------- Project Module ---------- */}
        <h3>Project Module</h3>
        <div style={styles.card}>
          <h4>Add Project</h4>
          <input
            style={styles.input}
            placeholder="Name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Description"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Status"
            value={newProject.status}
            onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Team"
            value={newProject.team}
            onChange={(e) => setNewProject({ ...newProject, team: e.target.value })}
          />
          <button style={styles.button} onClick={addProject}>Add Project</button>

          <h4>Existing Projects</h4>
          <ul>
            {projects.map(p => (
              <li key={p.id}>
                <strong>{p.name}</strong> - {p.status} - {p.team}
                <button style={styles.button} onClick={() => deleteProject(p.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Task Display & Reporting ---------- */}
        <h3>Tasks</h3>
        <div style={styles.card}>
          <h4>Task Summary</h4>
          <p>To Do: {taskCounts["To Do"] || 0}</p>
          <p>In Progress: {taskCounts["In Progress"] || 0}</p>
          <p>Done: {taskCounts["Done"] || 0}</p>
          <p>Overdue Tasks: {overdueTasks.length}</p>

          <h4>Existing Tasks</h4>
          <ul>
            {tasks.map(t => (
              <li key={t.id}>
                <strong>{t.title}</strong> - {t.status} - Assigned To: {t.assigned_user || "Unassigned"}
                {t.due_date && (
                  <span> | Due: {new Date(t.due_date).toLocaleDateString()}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
