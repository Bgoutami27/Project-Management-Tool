import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProjectManager.css"; // ✅ new external CSS file

function ProjectManagerPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    status: "Pending",
    team: "",
  });
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "To Do",
    assignedTo: "",
    projectId: "",
  });

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Fetch projects, tasks, users
  const fetchProjects = async () => {
    const res = await axios.get("https://project-management-tool-tuns.onrender.com/api/projects");
    setProjects(res.data);
  };

  const fetchTasks = async () => {
    const res = await axios.get("https://project-management-tool-tuns.onrender.com/api/tasks");
    setTasks(res.data);
  };

  const fetchUsers = async () => {
  const res = await axios.get("https://project-management-tool-tuns.onrender.com/api/users/developers");
  setUsers(res.data);
};


  useEffect(() => {
    fetchProjects();
    fetchTasks();
    fetchUsers();
  }, []);

  // ---------------- Project Handlers ----------------
  const handleProjectChange = (e) => {
    setProjectForm({ ...projectForm, [e.target.name]: e.target.value });
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (editingProjectId) {
      await axios.put(
        `https://project-management-tool-tuns.onrender.com/api/projects/${editingProjectId}`,
        projectForm
      );
      setEditingProjectId(null);
    } else {
      await axios.post("https://project-management-tool-tuns.onrender.com/api/projects", projectForm);
    }
    setProjectForm({
      name: "",
      description: "",
      status: "Pending",
      team: "",
    });
    fetchProjects();
  };

  const handleProjectEdit = (project) => {
    setProjectForm(project);
    setEditingProjectId(project.id);
  };

  const handleProjectDelete = async (id) => {
    await axios.delete(`https://project-management-tool-tuns.onrender.com/api/projects/${id}`);
    fetchProjects();
  };

  // ---------------- Task Handlers ----------------
  const handleTaskChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...taskForm,
      assigned_to: taskForm.assignedTo,
      project_id: taskForm.projectId,
    };
    if (editingTaskId) {
      await axios.put(
        `https://project-management-tool-tuns.onrender.com/api/tasks/${editingTaskId}`,
        payload
      );
      setEditingTaskId(null);
    } else {
      await axios.post("https://project-management-tool-tuns.onrender.com/api/tasks", payload);
    }
    setTaskForm({
      title: "",
      description: "",
      status: "To Do",
      assignedTo: "",
      projectId: "",
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
    });
    setEditingTaskId(task.id);
  };

  const handleTaskDelete = async (id) => {
    await axios.delete(`https://project-management-tool-tuns.onrender.com/api/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="pm-container">
      <nav className="pm-navbar">
        <h2>Project Manager Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </nav>

      <div className="pm-content">
        {/* ---- Projects ---- */}
        <section>
          <h3>Manage Projects</h3>
          <form onSubmit={handleProjectSubmit} className="pm-form">
            <input
              name="name"
              placeholder="Project Name"
              value={projectForm.name}
              onChange={handleProjectChange}
              required
            />
            <input
              name="description"
              placeholder="Description"
              value={projectForm.description}
              onChange={handleProjectChange}
              required
            />
            <input
              name="team"
              placeholder="Team Members (comma separated)"
              value={projectForm.team}
              onChange={handleProjectChange}
              required
            />
            <select
              name="status"
              value={projectForm.status}
              onChange={handleProjectChange}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <button type="submit">
              {editingProjectId ? "Update Project" : "Add Project"}
            </button>
          </form>

          <div className="pm-card-container">
            {projects.map((project) => (
              <div key={project.id} className="pm-card">
                <div className="pm-card-title">{project.name}</div>
                <p>{project.description}</p>
                <p>
                  <strong>Status:</strong> {project.status}
                </p>
                <p>
                  <strong>Team:</strong> {project.team}
                </p>
                <div className="pm-card-buttons">
                  <button onClick={() => handleProjectEdit(project)}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleProjectDelete(project.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Tasks ---- */}
        <section>
          <h3>Assign Tasks</h3>
          <form onSubmit={handleTaskSubmit} className="pm-form">
            <input
              name="title"
              placeholder="Task Title"
              value={taskForm.title}
              onChange={handleTaskChange}
              required
            />
            <input
              name="description"
              placeholder="Task Description"
              value={taskForm.description}
              onChange={handleTaskChange}
              required
            />
            <select
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
              name="assignedTo"
              value={taskForm.assignedTo}
              onChange={handleTaskChange}
              required
            >
              <option value="">Assign To Developer</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <select
              name="status"
              value={taskForm.status}
              onChange={handleTaskChange}
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
            <button type="submit">
              {editingTaskId ? "Update Task" : "Add Task"}
            </button>
          </form>

          <h3>Existing Tasks</h3>
          <div className="pm-card-container">
            {tasks.map((task) => (
              <div key={task.id} className="pm-card">
                <div className="pm-card-title">{task.title}</div>
                <p>{task.description}</p>
                <p>
                  <strong>Status:</strong> {task.status}
                </p>
                <p>
                  <strong>Project:</strong>{" "}
                  {projects.find((p) => p.id === task.project_id)?.name || "-"}
                </p>
                <p>
                  <strong>Assigned To:</strong>{" "}
                  {users.find((u) => u.id === task.assigned_to)?.name || "-"}
                </p>
                <div className="pm-card-buttons">
                  <button onClick={() => handleTaskEdit(task)}>Edit</button>
                  <button
                    onClick={() => handleTaskDelete(task.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProjectManagerPage;
