# 🚀 Step-by-Step Deployment Guide

Follow these steps exactly to deploy your Modex Booking System.

## Part 1: Push Code to GitHub
(If you haven't done this yet)
1.  Go to [GitHub.com](https://github.com) and create a **New Repository** (e.g., `modex-booking`).
2.  Open your VS Code terminal (Project Root) and run:
    ```bash
    git init
    git add .
    git commit -m "Final submission ready"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/modex-booking.git
    git push -u origin main
    ```

---

## Part 2: Deploy Backend (Render.com)
This will host your Node.js API and PostgreSQL Database.

1.  **Sign Up/Login**: Go to [dashboard.render.com](https://dashboard.render.com/) and log in with GitHub.
2.  **Create New Blueprint**:
    *   Click **"New +"** (Top Right) -> Select **"Blueprint Implementation"**.
    *   Connect your `modex-booking` repository.
    *   Give it a name (e.g., `modex-backend`).
3.  **Approve**: Render will scan the `render.yaml` file I created.
    *   It will ask to create a "Service" and a "Database".
    *   Click **"Apply"** or **"Approve"**.
4.  **Wait**: It will take 2-5 minutes to build.
5.  **Get the URL**:
    *   Once it says "Live", look for the **URL** at the top left of the dashboard (e.g., `https://modex-booking-backend-xyz.onrender.com`).
    *   **COPY THIS URL**. You need it for Part 3.

---

## Part 3: Deploy Frontend (Vercel)
This will host your React Application.

1.  **Sign Up/Login**: Go to [vercel.com](https://vercel.com/) and log in with GitHub.
2.  **Add New Project**:
    *   Click **"Add New..."** -> **"Project"**.
    *   Select your `modex-booking` repository -> Click **"Import"**.
3.  **Configure Project**:
    *   **Framework Preset**: Select **Create React App**.
    *   **Root Directory**: Click "Edit" and select the **`frontend`** folder. (Critical step!)
    *   **Environment Variables**:
        *   Expand "Environment Variables".
        *   **Name**: `REACT_APP_API_URL`
        *   **Value**: Paste your Render Backend URL (from Part 2). **Do NOT add a trailing slash `/`**.
            *   Correct: `https://modex-backend.onrender.com`
            *   Wrong: `https://modex-backend.onrender.com/`
4.  **Deploy**: Click **"Deploy"**.
5.  **Success**: within 1 minute, you will get a live URL (e.g., `https://modex-booking.vercel.app`).

---

## Part 4: Final Test
1.  Open your Vercel URL.
2.  Try to book an appointment (it should work).
3.  Visit `/admin` and create a show (it should work).

**You are now ready to record your video!** 🎥
