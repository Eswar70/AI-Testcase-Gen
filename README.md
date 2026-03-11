# AI Test Case Generator SaaS

A modern, full-stack SaaS application that leverages the Cohere AI engine to automatically generate comprehensive, structured test cases from raw user stories, acceptance criteria, or CSV/JSON uploads.

## 🚀 Features

- **AI-Powered Generation**: Instantly generate structured Functional, Edge, Positive, Negative, and Regression test cases using Cohere's Command-R-Plus model.
- **Test Suite Management & Simulation**: Automatically groups generated test cases into Suites. Features an animated UI to simulate a "Test Execution" cycle.
- **Real-Time Syncing Dashboard**: Centralized State Management ensures that Test Suites created or deleted in the Generator instantly sync across the Extent Reports and History Tabs.
- **Client-Side Extent Reports**: Beautifully rendered Recharts visualization of Pass/Fail ratios, completely exportable as a standalone HTML file.
- **Bulk Data Export**: Download your Test Suites as structured JSON or Excel-ready CSV files natively.
- **Cinematic UI**: Built with React, TailwindCSS v4, Framer Motion, and Lucide Icons for a glassy, premium dark-mode aesthetic.

---

## 🛠️ Tech Stack

### Frontend (User Interface)
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS, CSS Glassmorphism
- **Animations**: Framer Motion
- **Visuals**: Recharts (Dashboards)
- **Deployment Target**: Netlify

### Backend (API Layer)
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (Motor Async Driver)
- **AI Engine**: Cohere (`command-r-plus-08-2024`)
- **Architecture**: Clean Architecture (Routers -> Services -> Models)
- **Deployment Target**: Vercel

---

## 💻 Local Development Setup

### 1. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv .venv`
3. Activate the virtual environment:
   - Windows: `.venv\Scripts\activate`
   - Mac/Linux: `source .venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Set your environment variables in a `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://<your_user>:<your_pass>@cluster.mongodb.net/?retryWrites=true&w=majority
   COHERE_API_KEY=your_cohere_api_key_here
   ```
6. Run the server: `python -m uvicorn app.main:app --reload`
   - The API will run on `http://localhost:8000`

### 2. Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Optional: Create a `.env` file to override the local API url:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```
4. Run the development server: `npm run dev`
5. Access the application at `http://localhost:5173`

---

## ☁️ Deployment Guide

### Deploying the Backend to Vercel
We have included a `vercel.json` file in the backend folder to natively support Vercel's Python Serverless Functions.

1. Create an account on [Vercel](https://vercel.com).
2. Install the Vercel CLI (`npm i -g vercel`) or connect your GitHub repository to Vercel.
3. If using the Vercel Web Dashboard:
   - Import your GitHub repository.
   - Set the **Root Directory** to `backend/`.
   - Add your Environment Variables (`MONGODB_URI`, `COHERE_API_KEY`).
   - Click **Deploy**.
4. Save the generated Vercel API URL (e.g., `https://my-backend.vercel.app/api/v1`).

### Deploying the Frontend to Netlify
We have configured a `netlify.toml` file in the frontend folder to properly route the React Single Page Application (SPA).

1. Create an account on [Netlify](https://netlify.com).
2. Connect your GitHub repository to Netlify.
3. Set the following build settings:
   - **Base directory**: `frontend/`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Add your Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `<YOUR_VERCEL_BACKEND_URL>` (Do not forget the `/api/v1` suffix).
5. Click **Deploy Site**.

Enjoy your production-ready AI Test Case Generator!
