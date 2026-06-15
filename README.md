# Spur AI Live Chat Agent

A full-stack AI customer support chat agent built for the Spur take-home assignment.

**Live Demo:** https://your-frontend.vercel.app  
**Backend:** https://your-backend.onrender.com

---

## Tech Stack
- Frontend: React + TypeScript + Tailwind CSS + Vite
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL
- LLM: Google Gemini (gemini-2.5-flash)

---

## Local Setup

### 1. Clone the repo
git clone https://github.com/yourusername/spur-chat.git
cd spur-chat

### 2. Backend setup
cd backend
npm install
cp .env.example .env
# Fill in your values in .env

### 3. Setup database
psql -U postgres -c "CREATE DATABASE spurchat;"
npm run migrate
npm run seed

### 4. Start backend
npm run dev

### 5. Frontend setup
cd ../frontend
npm install
npm run dev

Open http://localhost:5173

---

## Environment Variables

### Backend (.env)
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/spurchat
GEMINI_API_KEY=your_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development

---

## Architecture

### Backend
- routes/ — API endpoints only
- services/llm.service.ts — all Gemini logic, generateReply()
- services/chat.service.ts — all DB queries
- middleware/ — input validation + error handling
- db/ — connection pool, migrations, seed data

### Frontend
- App.tsx — all state + layout
- Sidebar.tsx — past conversations + delete
- MessageList.tsx — messages + empty state + typing indicator
- InputBox.tsx — textarea + send button
- api.ts — all axios calls
- helpers.ts — utility functions

---

## LLM Notes
- Provider: Google Gemini (gemini-2.5-flash)
- Store policies loaded from DB and injected into system prompt on every request
- Last 10 messages sent as history for context
- Input capped at 2000 characters
- Escalation detection (talk to human) handled in code, not by LLM

---

## Trade-offs & If I Had More Time
- Add Redis to cache policies instead of DB query per request
- Stream Gemini responses token by token using SSE
- Add WhatsApp/Instagram channel adapters — generateReply() is already channel-agnostic
- Add vector search to inject only relevant policies per question
- Rate limiting per session


