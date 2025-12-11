# Modex Booking System (Assessment)

A production-grade Ticket/Doctor Appointment Booking System built with the PERN stack (PostgreSQL, Express, React, Node.js). 

This project demonstrates **high-concurrency handling**, **real-time updates**, and **modern UI/UX**.

## 🚀 Features

### Core Connectivity & Stability
*   **Concurrency Control**: Uses PostgreSQL **Pessimistic Locking (`FOR UPDATE`)** transactions to prevent race conditions and overbooking.
*   **Real-Time Updates**: Integrated **Socket.IO** to instantly reflect slot changes across all connected clients.
*   **Booking Lifecycle**: Implements `PENDING` -> `CONFIRMED` flow with **Auto-Expiry** (2 minutes) via background Cron jobs.

### User Features
*   Modern **Glassmorphism UI** using Tailwind CSS & Framer Motion.
*   **Smart Confirmation**: "Booked by You" indicators and intelligent error handling.
*   Responsive Design for Mobile & Desktop.

### Admin Features
*   **Secure Dashboard**: Role-based access control (RBAC).
*   **Show Management**: Create, Edit, and specific "Owner-Only" Deletion policies.

---

## 🛠 Tech Stack

*   **Frontend**: React (TypeScript), Tailwind CSS, Framer Motion, Axios, Socket.IO Client.
*   **Backend**: Node.js, Express, TypeScript, PostgreSQL (pg), Socket.IO.
*   **Docs**: Swagger UI (`/api-docs`).
*   **Architecture**: MVC, REST API, WebSocket.

---

## 🏃‍♂️ Getting Started

### Prerequisites
*   Node.js (v16+)
*   PostgreSQL

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/modex-booking.git
    cd modex-booking
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    
    # Create .env file
    echo "PORT=5000" > .env
    echo "DATABASE_URL=postgres://user:pass@localhost:5432/modex_db" >> .env
    echo "JWT_SECRET=supersecretkey" >> .env
    
    # Run Database Migration
    npm run migrate # Or run schema.sql manually
    
    # Start Server
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    
    # Create .env file
    echo "REACT_APP_API_URL=http://localhost:5000" > .env
    
    # Start Client
    npm start
    ```

---

## 📚 API Documentation

Once the backend is running, visit:
**`http://localhost:5000/api-docs`**

For full interactive API documentation via Swagger.

---

## 📦 Deployment

### Backend (Render.com)
This repo includes a `render.yaml` for 1-click deployment.
1.  Connect your repo to Render.
2.  It will automatically detect the Blueprint and create the `Web Service` + `PostgreSQL`.

### Frontend (Vercel/Netlify)
1.  Import the repository.
2.  Set Root Directory to `frontend`.
3.  Set Build Command: `npm run build`.
4.  Add Environment Variable: `REACT_APP_API_URL` = (Your Render Backend URL).

---

## 🎥 Video Walkthrough

[Link to Video Submission]

---

**Author**: [Your Name]
**Reasoning**: This architecture was chosen to prioritize **Data Consistency** over Eventual Consistency for booking critical slots, ensuring zero overbookings.
