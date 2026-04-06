# Task Management System (MERN Stack)

This is a full-stack web application designed for better coordination between Administrators and Employees. It features a complete role-based access control (RBAC) system with an integrated approval workflow.

##  Key Features

### Admin Portal
- **Dashboard Overview**: Monitor all global tasks and their current status (Pending / In Progress / Completed).
- **Employee Access Control**: View all new registrations and manually **Approve** or **Revoke** access.
- **Task Assignment**: Easily assign new tasks to specific employees using a user-friendly dropdown menu.
- **Task Management**: Create, view, and delete assignments.

### Employee Portal
- **Formal Registration**: New employees can "Apply for Access" through a formal registration form.
- **Status Gating**: Login is only permitted **after** an administrator approves the application.
- **Personalized Workspace**: View only the tasks assigned specifically to you.
- **Progress Tracking**: Update your task status as you work (Start Task -> Complete Task).

##  Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS (for modern, responsive styling)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT) & BcryptJS (Password Encryption)

---

## How to Setup the Project

### 1. Prerequisites
Make sure you have **Node.js** and **MongoDB** installed and running on your local machine.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables in a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/task_mgmt
   JWT_SECRET=your_secret_key_here
   ```
4. **Seed the Admin User** (Critical Step):
   Run the following command to create the default system administrator:
   ```bash
   node scripts/seed.js
   ```
5. Start the backend server:
   ```bash
   node server.js
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application at: `http://localhost:3000`

---

## Default Admin Access
- **Email**: `admin@example.com`
- **Password**: `adminpassword`

## Workflow for Evaluation
To test the "Separate Portals" and "Approval System":
1. **Register**: Go to the `/register` page and create a new employee account.
2. **Login Attempt**: Try logging in with the new account—you will be blocked with a "Pending Approval" message.
3. **Approve**: Log in as the **Admin**, go to the **Users Control** tab, and click **Approve Access** for your new user.
---

## API Testing (cURL)

You can test the backend directly using these cURL commands:

### 1. Employee Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name": "Dharaneesh", "email": "dharaneeshj454@gmail.com", "password": "password123"}'
```

### 2. Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "admin@example.com", "password": "adminpassword"}'
```

### 3. Get All Users (Admin Role Required)
*Replace `<TOKEN>` with the JWT from step 2.*
```bash
curl -X GET http://localhost:5000/api/auth/users \
-H "Authorization: Bearer <TOKEN>"
```

### 4. Create Task (Admin Role Required)
*Replace `<EMPLOYEE_ID>` and `<TOKEN>`.*
```bash
curl -X POST http://localhost:5000/api/tasks \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{"title": "Complete Design", "description": "Finish the task system UI", "assignedTo": "<EMPLOYEE_ID>", "deadline": "2026-05-01"}'
```

---


