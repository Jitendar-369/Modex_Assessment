# Modex Booking System - System Design Document

## 1. High-Level Architecture
The system is architected as a **Client-Server** application, designed to be stateless and horizontally scalable. It consists of three primary layers:
1.  **Client Layer (Frontend)**: A React.js Single Page Application (SPA) that communicates with the backend via REST APIs and WebSockets (Socket.IO).
2.  **Application Layer (Backend)**: A Node.js/Express.js server responsible for business logic, authentication, and handling concurrency.
3.  **Data Layer (Database)**: PostgreSQL for persistent transactional storage.

### Component Interaction
```mermaid
graph TD
    Client[React Client] <-->|REST API + Socket.IO| LB[Load Balancer]
    LB --> Server1[Node.js Server Instance 1]
    LB --> Server2[Node.js Server Instance 2]
    Server1 <-->|Transactional Reads/Writes| DB[(PostgreSQL Primary)]
    Server2 <-->|Transactional Reads/Writes| DB
    Server1 -->|Cache Reads (Optional)| Redis[(Redis Cache)]
    Server2 -->|Cache Reads (Optional)| Redis
```

---

## 2. Database Design & Scalability
The database schema is normalized to 3NF to ensure data integrity.

### Schema Overview
*   **Users**: Stores authentication info (`email`, `password_hash`, `role`).
*   **Shows**: Represents a bookable entity (Doctor schedule, Bus trip). Contains `total_slots` and `available_slots`.
*   **Bookings**: Represents a transaction. Contains `status` (`PENDING`, `CONFIRMED`, `CANCELLED`) and `expires_at`.

### Scalability Strategy
To support a production-grade load (2,500+ candidates or millions of users like RedBus):

1.  **Read Replicas**:
    *   Write operations (Booking, Creating Shows) go to the **Primary** instance.
    *   Read operations (Fetching lists of shows) are distributed to **Read Replicas**.
    *   This offloads majority of the traffic (90% read / 10% write ratio).

2.  **Database Sharding**:
    *   For extreme scale, we would shard the database based on `show_id` or `region` (e.g., Shows in 'North' vs 'South'). This ensures queries hit smaller datasets.

3.  **Connection Pooling**:
    *   We use `pg-pool` to manage database connections efficiently, preventing connection exhaustion under high load.

---

## 3. Concurrency Control (The Core Challenge)
Preventing double-booking is the critical requirement. We solve this using **Pessimistic Locking** via Database Transactions.

### The Problem
If User A and User B request the last seat simultaneously:
1.  User A reads `available_slots = 1`
2.  User B reads `available_slots = 1`
3.  User A writes `available_slots = 0`
4.  User B writes `available_slots = 0` (Overwrite/Race Condition)
Result: Overbooking (-1 slots).

### The Solution (Implemented)
We use `SELECT ... FOR UPDATE` row-level locks.

```sql
BEGIN;
-- Locks the specific row. No other transaction can read/write this row until we commit.
SELECT * FROM shows WHERE id = $1 FOR UPDATE; 

-- Check slots
IF available_slots > 0 THEN
   INSERT INTO bookings ...;
   UPDATE shows SET available_slots = available_slots - 1 ...;
   COMMIT;
ELSE
   ROLLBACK;
END IF;
```
This guarantees **Atomicity** and **Isolation**, ensuring exactly one user secures the slot.

---

## 4. Real-Time Updates & WebSocket Strategy
To enhance UX, we do not rely solely on user-initiated refresh.
*   **Socket.IO** is implemented to broadcast `showsUpdated` events whenever a booking is made or cancelled.
*   This ensures all active clients see the available slot count decrement instantly.

---

## 5. Booking Expiry (Pending State)
We implement a "Hold" mechanism:
1.  User clicks "Book" -> Creates a `PENDING` booking and decrements a slot immediately.
2.  User has 2 minutes to `CONFIRM`.
3.  **Cron Job / Expiry Service**: A background worker (implemented via `node-cron`) runs every minute to find `PENDING` bookings where `expires_at < NOW()`.
4.  It automatically marks them `CANCELLED` and increments the slot count back.

---

## 6. Future Scalability Improvements
For a fully distributed production system (RedBus scale):

1.  **Redis for Caching**: Cache the "List of Shows" response. Invalidate cache only on Show CRUD or Booking events.
2.  **Message Queues (RabbitMQ/Kafka)**:
    *   Decouple the "Booking Confirmation" email/SMS notification from the main HTTP request flow.
    *   Offload the "Expiry Check" to a dedicated worker service rather than running robust Cron on the API server.
