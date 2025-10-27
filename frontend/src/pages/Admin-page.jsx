import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function AdminPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]); // ✅ for Project Managers list
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    team: "",
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    status: "To Do",
    deadline: "",
  });

  const [editingTaskId, setEditingTaskId] = useState(null);

  // ---------- Fetch data ----------
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

  const fetchProjectManagers = async () => {
    const res = await axios.get(
      "https://project-management-tool-tuns.onrender.com/api/users/projectmanagers"
    );
    setUsers(res.data);
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchProjectManagers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // ---------- Project CRUD ----------
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

  // ---------- Task Handlers ----------
  const handleTaskChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: taskForm.title,
      description: taskForm.description,
      status: taskForm.status,
      project_id: taskForm.projectId,
      assigned_to: taskForm.assignedTo,
      deadline: taskForm.deadline,
    };

    if (editingTaskId) {
      await axios.put(
        `https://project-management-tool-tuns.onrender.com/api/tasks/${editingTaskId}`,
        payload
      );
      setEditingTaskId(null);
    } else {
      await axios.post(
        "https://project-management-tool-tuns.onrender.com/api/tasks",
        payload
      );
    }

    setTaskForm({
      title: "",
      description: "",
      projectId: "",
      assignedTo: "",
      status: "To Do",
      deadline: "",
    });
    fetchTasks();
  };

  const handleTaskEdit = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description,
      status: task.status,
      assignedTo: task.assigned_to || "",
      projectId: task.project_id || "",
      deadline: task.deadline || "",
    });
    setEditingTaskId(task.id);
  };

  const handleTaskDelete = async (id) => {
    await axios.delete(
      `https://project-management-tool-tuns.onrender.com/api/tasks/${id}`
    );
    fetchTasks();
  };

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
    card: {
      background: "rgba(255, 255, 255, 0.9)",
      borderRadius: "16px",
      padding: "25px",
      marginBottom: "30px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
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

      {/* ---------- PROJECT MANAGEMENT ---------- */}
      <div style={styles.card}>
        <h3>📁 Project Management</h3>
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
        <ul>
          {projects.map((p) => (
            <li key={p.id}>
              {p.name} — {p.team}{" "}
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

      {/* ---------- TASK ASSIGNMENT TO PROJECT MANAGERS ---------- */}
      <div style={styles.card}>
        <h3>🧾 Assign Tasks to Project Managers</h3>
        <form onSubmit={handleTaskSubmit}>
          <input
            style={styles.input}
            placeholder="Task Title"
            name="title"
            value={taskForm.title}
            onChange={handleTaskChange}
            required
          />
          <input
            style={styles.input}
            placeholder="Task Description"
            name="description"
            value={taskForm.description}
            onChange={handleTaskChange}
            required
          />
          <input
            style={styles.input}
            type="date"
            name="deadline"
            value={taskForm.deadline}
            onChange={handleTaskChange}
            required
          />
          <select
            style={styles.input}
            name="projectId"
            value={taskForm.projectId}
            onChange={handleTaskChange}
            required
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            style={styles.input}
            name="assignedTo"
            value={taskForm.assignedTo}
            onChange={handleTaskChange}
            required
          >
            <option value="">Assign to Project Manager</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <select
            style={styles.input}
            name="status"
            value={taskForm.status}
            onChange={handleTaskChange}
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          <button style={styles.addBtn} type="submit">
            {editingTaskId ? "Update Task" : "Add Task"}
          </button>
        </form>

        <h3>📋 Existing Tasks</h3>
        {tasks.map((t) => (
          <div key={t.id}>
            <strong>{t.title}</strong> — {t.status} |{" "}
            {users.find((u) => u.id === t.assigned_to)?.name || "-"} |{" "}
            {t.deadline
              ? new Date(t.deadline).toLocaleDateString()
              : "No deadline"}
            <button
              style={styles.deleteBtn}
              onClick={() => handleTaskDelete(t.id)}
            >
              Delete
            </button>
            <button
              style={styles.addBtn}
              onClick={() => handleTaskEdit(t)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;
