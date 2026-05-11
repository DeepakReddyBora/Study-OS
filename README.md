# AI Study Planner

An AI-powered study planning web application built using the MERN stack. The platform helps students create personalized study plans, manage learning schedules, and interact with an AI assistant for productivity and academic guidance.

---

# Features

* User Authentication (Login / Signup)
* JWT-based Authentication
* AI Study Assistant
* Personalized Study Planning
* Profile Management
* Protected Routes
* Responsive UI
* MongoDB Database Integration
* REST API Architecture
* Deployed on Vercel

---

# Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* dotenv

## Deployment

* Frontend: Vercel
* Backend: Vercel
* Database: MongoDB Atlas

---

# Project Structure

```txt
root/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── controllers/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

# Environment Variables

Create a `.env` file inside the backend folder.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_api_key
```

---

# API Routes

## Authentication

```txt
POST /api/auth/signup
POST /api/auth/login
```

## Profile

```txt
GET /api/profile
PUT /api/profile
```

## AI Assistant

```txt
POST /api/ai
```

---

# Deployment

## Frontend Deployment

* Deploy frontend separately on Vercel
* Root Directory: `frontend`
* Framework Preset: `Vite`

### frontend/vercel.json

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Backend Deployment

* Deploy backend separately on Vercel
* Root Directory: `backend`
* Framework Preset: `Other`

---

# Screenshots

Add screenshots of:

* Home Page
* Login Page
* Signup Page
* Dashboard
* AI Assistant
* Study Planner

---

# Future Improvements

* Study Progress Tracking
* AI-generated Timetables
* Pomodoro Timer
* Notes System
* Calendar Integration
* Notifications & Reminders
* Dark Mode & Light Mode

---

# Author

Deepak Reddy Bora

---

# License

This project is for educational and portfolio purposes.
