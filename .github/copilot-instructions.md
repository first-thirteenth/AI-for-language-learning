# AI for Language Learning — Copilot Instructions

## 🎯 Project Overview
Mobile application for language learning using AI.
- **Platform:** iOS first, Android later
- **Target:** Beginners learning new languages through AI conversation, speech, and exercises

## 🏗️ Tech Stack

### Mobile (Frontend)
- **React Native** + **Expo** (SDK 51+) + **TypeScript**
- **Expo Router** — file-based navigation
- **Zustand** — state management
- **React Query (TanStack Query)** — server state, caching
- **NativeWind** — Tailwind CSS for React Native styling

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Hosted on:** Render.com (free tier)
- **REST API** architecture

### Database & Auth
- **Supabase** — PostgreSQL database, Auth, Storage
- Row Level Security (RLS) always enabled

### AI & Speech
- **OpenAI GPT-4o-mini** — conversations, explanations, exercises
- **OpenAI Whisper** — speech-to-text
- **OpenAI TTS** — text-to-speech

## 📁 Project Structure

```
ai-language-learning/
├── apps/
│   ├── mobile/                  # React Native + Expo app
│   │   ├── app/                 # Expo Router pages
│   │   │   ├── (auth)/          # Auth screens
│   │   │   ├── (tabs)/          # Main tab navigation
│   │   │   └── _layout.tsx
│   │   ├── components/          # Reusable UI components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── stores/              # Zustand stores
│   │   ├── services/            # API calls
│   │   ├── types/               # TypeScript types
│   │   └── utils/               # Helper functions
│   └── backend/                 # Node.js + Express API
│       ├── src/
│       │   ├── routes/          # Express routes
│       │   ├── controllers/     # Route handlers
│       │   ├── services/        # Business logic
│       │   ├── middleware/      # Auth, validation, error handling
│       │   ├── models/          # TypeScript interfaces for DB
│       │   └── utils/           # Helpers
│       └── supabase/
│           └── migrations/      # SQL migrations
└── .github/
    ├── copilot-instructions.md  # This file
    └── prompts/                 # Specialized agents
```

## 📐 Coding Rules (Senior Standards)

### General
- **Always TypeScript** — no `any`, use proper types
- **No magic strings** — use constants or enums
- **Error handling** — always handle errors explicitly, no silent catches
- **Small functions** — one function = one responsibility
- **Meaningful names** — variables and functions must be self-explanatory

### React Native
- **Functional components only** — no class components
- **Custom hooks** for logic, components only for UI
- **NativeWind** for styling — no inline styles unless dynamic
- **Always handle loading and error states** in UI
- **Accessibility** — always add `accessibilityLabel` to interactive elements

### Backend (Node.js)
- **Async/await** everywhere — no callbacks, no `.then()`
- **Zod** for request validation
- **HTTP status codes** must be correct (200, 201, 400, 401, 403, 404, 500)
- **Never expose internal errors** to client responses
- **Environment variables** for all secrets — never hardcode

### Supabase / Database
- **Always use RLS** (Row Level Security)
- **Migrations only** — never change DB schema manually
- **Indexes** on columns used in WHERE clauses

### Git
- **Branch naming:** `feature/short-description`, `fix/short-description`, `chore/short-description`
- **Commit messages:** conventional commits — `feat:`, `fix:`, `chore:`, `refactor:`
- **Feature branches** off `copilot/worktree-2026-06-01T11-11-19`
- **PR before merging** to main development branch

## 🔐 Security Rules
- All API keys in `.env` files — never in code
- `.env` always in `.gitignore`
- JWT tokens for auth — stored in SecureStore (Expo), never AsyncStorage
- Validate all user input on backend with Zod

## 🤖 AI Integration Guidelines
- Use `gpt-4o-mini` by default (cheapest, fast)
- Always stream responses for better UX
- Keep system prompts in separate constant files
- Implement rate limiting per user to control OpenAI costs
- Cache AI responses where appropriate (React Query)
