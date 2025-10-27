### How to Run the Project
## Backend Setup
1.cd backend
2.node server.js

# Install dependencies
npm install
# frontend setup
1.cd frontend
2.npm install

# Set up environment variables
# Create a .env file in the backend folder with:
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://user:password@localhost:5432/yourdb


## Database Schema

The backend uses **PostgreSQL** for persistent data storage.

### Tables Overview
  **users** → stores login and role information  
  **projects** → contains project details  
  **tasks** → tracks project tasks and assignments  
  **project_members** → links users to projects (many-to-many)

### Enums
- `roleenum` → ['ADMIN', 'MANAGER', 'DEVELOPER']
- `taskstatus` → ['To Do', 'In Progress', 'Done']


📡 API Endpoints Summary
### User Routes
| Method | Endpoint    | Description                                        | Access |
| ------ | ----------- | -------------------------------------------------- | ------ |
| `POST` | `/register` | Register a new user (Admin, Manager, or Developer) | Public |
| `POST` | `/login`    | Login and get JWT token                            | Public |
### Project Routes
| Method   | Endpoint | Description         | Access         |
| -------- | -------- | ------------------- | -------------- |
| `GET`    | `/`      | Fetch all users     | Admin          |
| `GET`    | `/:id`   | Get user by ID      | Admin, Manager |
| `POST`   | `/add`   | Add a new user      | Admin          |
| `PUT`    | `/:id`   | Update user details | Admin          |
| `DELETE` | `/:id`   | Delete user         | Admin          |
### Task Routes
| Method   | Endpoint  | Description                                  | Access             |
| -------- | --------- | -------------------------------------------- | ------------------ |
| `GET`    | `/`       | Get all tasks                                | All roles          |
| `GET`    | `/:id`    | Get task by ID                               | All roles          |
| `POST`   | `/create` | Create task under a project                  | Admin, Manager     |
| `PUT`    | `/:id`    | Update task details (status, deadline, etc.) | Manager, Developer |
| `DELETE` | `/:id`    | Delete task                                  | Admin              |

### Assumptions
Each user can have only one role (ADMIN, MANAGER, or DEVELOPER).

A project can have multiple members (developers).

A task belongs to one project and can be assigned to one developer.

Authentication is handled using JWT tokens.
### Possible Improvements

Add notifications for task updates or comments

Implement password reset and email verification.

Add file uploads (e.g., project documents).

Search Functionality

Profile Page
