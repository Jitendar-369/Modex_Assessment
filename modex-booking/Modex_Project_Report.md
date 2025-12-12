# Modex Assessment - Technical Submission Report

**Candidate Name:** [Your Name Here]
**Project:** High-Concurrency Ticket Booking System
**Date:** 2025-12-12

---

## 1. Project Overview
This project is a full-stack Ticket/Doctor Appointment Booking System designed to handle high-concurrency scenarios. It ensures data consistency (zero overbooking) while providing a real-time, responsive user experience. 

**Live Deployment:**
*   **Frontend:** [Insert Vercel URL Here]
*   **Backend:** [Insert Render URL Here]
*   **API Docs:** [Insert Render URL Here]/api-docs

**GitHub Repository:**
*   [Insert GitHub Repo Link Here]

---

## 2. System Architecture
The application follows a robust **Client-Server Architecture**:

*   **Frontend (Client Layer)**: Built with **React.js (TypeScript)**. It utilizes **Socket.IO Client** for real-time updates and **React Context API** for global state management (Auth, BookingFlow).
*   **Backend (Application Layer)**: A **Node.js/Express** REST API. It handles business logic, authentication (JWT), and manages database transactions.
*   **Database (Data Layer)**: **PostgreSQL** relational database. Used for strict schema enforcement and transactional integrity.

### Key Components
1.  **Concurrency Controller**: Manages the `book` and `confirm` logic using pessimistic locking.
2.  **Real-Time Service**: A Socket.IO instance that broadcasts `showsUpdated` events to all connected clients whenever availability changes.
3.  **Expiry Cron Job**: A background worker (using `node-cron`) that runs every minute to release slots from "Pending" bookings that have expired ( > 2 mins).

---

## 3. Database Design
The database is normalized to ensure data integrity.

### Schema
*   **Users Table**: `id`, `name`, `email` (Indexed, Unique), `password_hash`, `role` (admin/user).
*   **Shows Table**: `id`, `name` (Doctor/Bus Name), `start_time`, `total_slots`, `available_slots`.
    *   *Index*: `start_time` for faster scheduling queries.
*   **Bookings Table**: `id`, `user_id`, `show_id`, `status` (PENDING, CONFIRMED, CANCELLED), `expires_at`.
    *   *Index*: `status` to quickly identify Pending/Expired bookings.

### Scalability Strategy
To scale this to millions of users (like RedBus):
1.  **Read Replicas**: Separate the "Read" traffic (Listing Shows) to read-only database replicas, while "Write" traffic (Booking) goes to the primary.
2.  **Sharding**: The database can be sharded by `Region` or `ShowID` to distribute the load.

---

## 4. Concurrency & Race Condition Handling (Critical)
The core challenge was ensuring that two users cannot book the last seat simultaneously.

**Solution: Pessimistic Locking (SELECT ... FOR UPDATE)**
I implemented database-level locking within a transaction:

```sql
BEGIN;
-- This line locks the specific Show row.
-- No other transaction can read/write this row until I commit.
SELECT * FROM shows WHERE id = $1 FOR UPDATE;

IF available_slots > 0 THEN
    -- Secure the slot
    UPDATE shows SET available_slots = available_slots - 1 ...;
    INSERT INTO bookings ...;
    COMMIT;
ELSE
    -- Fail safely
    ROLLBACK;
END IF;
```

This guarantees **Atomicity** and **Isolation**, making overbooking mathematically impossible at the database level.

---

## 5. Innovation & UX Features
1.  **Real-Time Updates**: Unlike standard apps that require a refresh, this system uses **WebSockets**. When User A books a seat, User B sees the slot count decrease *instantly* with a visual flash animation.
2.  **Smart Recovery**: If a user disconnects or the browser crashes, the "Verify-After-Failure" logic on the frontend checks the server state upon reconnection to confirm the booking status accurately.
3.  **Glassmorphism UI**: A modern, premium aesthetic using Tailwind CSS and Framer Motion for smooth transitions.

---

## 6. API Documentation
The API is fully documented using **Swagger/OpenAPI**.
Endpoints include:
*   `GET /shows`: List all available shows.
*   `POST /bookings`: Initiate a pending booking (locks slot).
*   `POST /bookings/confirm`: Finalize appointment.
*   `GET /bookings/my-bookings`: Retrieve user history.

---

**Setup Instructions:**
See `README.md` in the repository for detailed local setup and deployment steps.
