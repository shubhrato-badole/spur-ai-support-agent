# Spur AI Live Chat Agent

A full-stack AI customer support chat agent built for the Spur take-home assignment. Users can chat with an AI agent that answers questions about store policies using Google Gemini as the LLM backend.

Live Demo: https://your-frontend.vercel.app

Backend API: https://your-backend.onrender.com



## Tech Stack


Frontend: React + TypeScript + Tailwind CSS + Vite
Backend: Node.js + Express + TypeScript
Database: PostgreSQL
Cache: Redis (Upstash)
LLM: Google Gemini (gemini-2.5-flash)



## Local Setup

Prerequisites

Node.js 18+
PostgreSQL 14+
A Gemini API key (free at aistudio.google.com)
A Redis URL (free at upstash.com)


1. Clone the repo

bashgit clone https://github.com/yourusername/spur-chat.git
cd spur-chat

2. Backend setup

bashcd backend
npm install
cp .env.example .env

# Fill in your values in .env

3. Setup database

bashpsql -U postgres -c "CREATE DATABASE spurchat;"
npm run migrate
npm run seed

4. Start backend

bashnpm run dev

5. Frontend setup

bashcd ../frontend
npm install
npm run dev

Open http://localhost:5173


## Environment Variables

Backend .env

PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/spurchat
GEMINI_API_KEY=your_gemini_key
REDIS_URL=rediss://your-upstash-url
CLIENT_URL=http://localhost:5173
NODE_ENV=development

Frontend .env

VITE_API_URL=https://your-backend.onrender.com


## Architecture

backend/src/
  routes/
    chat.routes.ts      — 3 endpoints: POST /chat/message, GET /chat/conversations, DELETE /chat/conversations/:id
  services/
    llm.service.ts      — Gemini API call + Redis policy caching
    chat.service.ts     — all DB queries for conversations and messages
  middleware/
    validate.ts         — input validation (empty, too long)
    errorHandler.ts     — maps all errors to friendly messages
  db/
    index.ts            — PostgreSQL connection pool
    migrate.ts          — migration runner
    seed.ts             — seeds store policies into DB
    migrations/
      001_init.sql      — creates conversations, messages, policies tables

frontend/src/
  App.tsx               — all state + layout
  Sidebar.tsx           — past conversations list + delete
  MessageList.tsx       — messages + empty state + typing indicator
  InputBox.tsx          — textarea + send button
  api.ts                — all axios calls
  helpers.ts            — timeAgo, formatTime, SUGGESTIONS

Key design decisions

1. LLM service is channel-agnostic
generateReply(history, message) takes plain arrays. The same function works identically for a WhatsApp or Instagram handler — just wire a different route to it.

2. Policies stored in DB, cached in Redis
Store knowledge lives in a policies table, loaded on first request and cached in Redis for 1 hour. Policies can be updated without redeploying code.

3. Escalation handled in code, not by LLM
If a user says "talk to a human", the backend detects it with a keyword check and returns a hardcoded response without calling Gemini. Cheaper, faster, 100% reliable.

4. Separation of concerns
Routes only handle HTTP. Services handle business logic. No DB queries in routes, no HTTP logic in services.


## LLM Notes

Provider: Google Gemini (gemini-2.5-flash)

Prompting strategy:


System prompt contains all store policies loaded from DB
Strict rules injected to prevent out-of-scope answers
Last 10 messages sent as history for context
Input capped at 2000 characters server-side


Guardrails:


Out-of-scope questions → polite refusal
Unknown questions → directs to support email
Escalation triggers → handled in code, never reaches LLM



## Caching


Store policies cached in Redis (Upstash) with 1-hour TTL
Cache key: spur:policies
First request: DB → Redis → response
Subsequent requests: Redis → response (no DB hit)



## Trade-offs & If I Had More Time

Streaming — Stream Gemini responses token by token using SSE for faster perceived response time
WhatsApp/Instagram adapters — generateReply() is already channel-agnostic, adding a new channel is just a new route
Vector search / RAG — inject only relevant policies per question using embeddings instead of all policies every time
Rate limiting — add per-session rate limiting using express-rate-limit
Admin panel — UI to edit store policies without touching the DB directly
Auth — session-based auth to associate conversations with users