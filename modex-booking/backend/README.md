# Backend - Doctor Appointment System

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- PostgreSQL

### Installation
1.  Clone the repository.
2.  Navigate to `backend` directory.
3.  Run `npm install`.

### Database Setup
1.  Create a PostgreSQL database (e.g., `modex_booking`).
2.  Update `.env` with your `DATABASE_URL`.
3.  Run the SQL commands in `schema.sql` to create tables.

### Running the Server
- Development: `npm run dev`
- Production: `npm run build` then `npm start`

## API Documentation

### Auth
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login and get token.

### Shows
- `GET /api/shows`: Get all shows.
- `GET /api/shows/:id`: Get show details.
- `POST /api/shows`: Create a show (Admin only).
- `PUT /api/shows/:id`: Update a show (Admin only).
- `DELETE /api/shows/:id`: Delete a show (Admin only).

### Bookings
- `POST /api/bookings`: Book a slot.
- `GET /api/bookings/my-bookings`: Get user bookings.
- `PUT /api/bookings/:id/cancel`: Cancel a booking.

## Concurrency Handling
We use **Pessimistic Locking** with PostgreSQL `FOR UPDATE` clause to handle concurrent bookings.
When a user attempts to book a slot:
1.  A transaction is started.
2.  The show row is locked using `SELECT ... FOR UPDATE`.
3.  We check if `available_slots > 0`.
4.  If yes, we insert the booking and decrement the slot count.
5.  The transaction is committed, releasing the lock.

This ensures that no two users can book the last slot simultaneously.
