# Pre-Submission Checklist & Video Script

## 🛑 Phase 1: The "Dry Run" (Test these LOCALLY first)
Before you deploy or record, make sure these specific "Happy Paths" work perfectly.

### Test 1: The "Real-Time" Wow Factor
1.  Open **Chrome** (Admin) and **Incognito Window** (User).
2.  **Chrome**: Create a new Show with **5 slots**.
3.  **Incognito**: Go to the dashboard. *Did the new show appear instantly without refreshing?* (It should).
4.  **Incognito**: Click "Book".
5.  **Chrome**: Look at the slot count. *Did it drop to 4 instantly?*
6.  **Incognito**: Click "Confirm".
7.  **Chrome**: *Did the slot count stay at 4?* (Correct).

### Test 2: The "Expiry" Check (Crucial for Bonus Points)
1.  Book a slot but **DO NOT Confirm**.
2.  Wait 2 minutes (or whatever your Env var `BOOKING_EXPIRY` is set to).
3.  *Does the slot count go back up automatically?*
4.  *Does the modal close or show an error when you try to confirm late?*

### Test 3: Admin Power
1.  Try to delete a show you created. (Should work).
2.  Try to create a show with invalid data (empty fields). (Should show error).

---

## 🚀 Phase 2: Deployment Order
You must deploy in this order because Frontend needs the Backend URL.

1.  **Deploy Backend to Render.com**
    *   Connect Repo.
    *   Render will read `render.yaml`.
    *   It will create the DB and the Web Service.
    *   **Copy the URL** (e.g., `https://modex-backend.onrender.com`).
2.  **Deploy Frontend to Vercel/Netlify**
    *   Import Repo.
    *   **Add Env Var**: `REACT_APP_API_URL` = `https://modex-backend.onrender.com` (The one you just copied).
    *   Deploy.

---

## 🎥 Phase 3: The Video Script (Max 5-7 Mins)
**Software**: OBS Studio or Loom.  
**Microphone**: Clear audio is key.

### Part A: Introduction (30s)
*   "Hi, I'm [Name]. This is my submission for the Modex Assessment."
*   "I built a High-Concurrency Ticket Booking System using the PERN stack."
*   "My focus was on **Data Integrity** (preventing overbooking) and **Real-Time UX**."

### Part B: Deployment & Architecture (1 min)
*   **Show Diagram**: Open `SYSTEM_DESIGN.md` (Preview mode) and briefly point to the architecture. "I used a Client-Server architecture..."
*   **Show Render Dashboard**: "The backend is hosted on Render with a dedicated PostgreSQL instance."
*   **Show Vercel/Netlify**: "Frontend is on Vercel."
*   **Show Swagger**: Open `/api-docs`. "I've documented all endpoints using Swagger."

### Part C: The Feature Demo (The Main Event) (3 mins)
*   **Setup**: Split your screen. Left side = **Client A**, Right side = **Client B**.
*   **Action**:
    1.  "Watch as I book a slot on the left." -> Click Book.
    2.  "Notice on the right, the slots dropped instantly via WebSockets."
    3.  Confirm the booking on the left.
    4.  Show "Booked by You" status.
    5.  (optional) Show the "Expiry" logic if you have time, or just explain it. "If I don't confirm in 2 mins, the Cron job releases this slot."

### Part D: Code Walkthrough (Innovation) (1.5 mins)
*   **Switch to VS Code**.
*   **Highlight 1**: `bookingController.ts`. Show the `BEGIN`, `FOR UPDATE`, and `COMMIT` lines. "This Transaction Lock is how I guarantee zero overbookings."
*   **Highlight 2**: `socket.ts` or `ShowList.tsx`. "I used React Context and Socket.IO for the live updates."

### Part E: Conclusion
*   "Ideally, I'd scale this further with Redis caching and Sharding, as detailed in my System Design doc."
*   "Thank you!"
