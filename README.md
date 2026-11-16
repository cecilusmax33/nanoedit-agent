<p align="center"><img src="https://raw.githubusercontent.com/cecilusmax33/cecilusmax33/main/assets/logos/nanoedit-agent-logo.png" alt="nanoedit-agent logo" width="220"></p>

# NanoEdit Agent

A powerful image editing agent powered by Gemini 2.5 Flash Image (Nano Banana). Upload images, describe edits in natural language, and manage project context.

Built from a Google AI Studio export: a Vite + React chat-style editor, plus a small Node proxy server so the app can run in production **without exposing the Gemini API key in the frontend code**.

## Features

- **Chat-based image editing** — upload an image and describe edits in plain words (`components/ChatInterface.tsx`)
- **Project sidebar & settings** — manage project context and model settings (`components/Sidebar.tsx`, `components/SettingsModal.tsx`)
- **Gemini image service** — calls Gemini 2.5 Flash Image via `@google/genai` (`services/geminiService.ts`)
- **Production proxy** — Express + WebSocket server (`server/server.js`) that injects the API key server-side, with rate limiting and a service worker / WebSocket interceptor for AI Studio-style traffic

## Tech stack

- Vite 6 + React 19 + TypeScript, react-markdown, Lucide icons
- `@google/genai` SDK
- Server: Express 4, `ws`, axios, express-rate-limit (in `server/`)

## Getting started (development)

### Prerequisites

- Node.js 20+
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local and set GEMINI_API_KEY
npm run dev
```

Open http://localhost:3000.

> In dev, Vite injects `GEMINI_API_KEY` into the frontend (see `vite.config.ts`), which is fine locally. For anything public, run the proxy server below so the key stays on the server.

## Running in production (proxy server)

```bash
cd server
npm install
GEMINI_API_KEY=your-key npm start
```

The server serves the built frontend from `dist/` and proxies Gemini calls with the key kept server-side.

## Deploy to Cloud Run

Prerequisites: [Google Cloud SDK / gcloud CLI](https://cloud.google.com/sdk/docs/install).

Store the key as a secret:

```bash
echo -n "${GEMINI_API_KEY}" | gcloud secrets create gemini_api_key --data-file=-
```

Deploy (a `Dockerfile` is included):

```bash
gcloud run deploy nanoedit-agent --source=. --update-secrets=GEMINI_API_KEY=gemini_api_key:latest
```

## Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | Gemini API key. The server also accepts `API_KEY`; `GEMINI_API_KEY` takes precedence. |

## Project structure

```
App.tsx, index.tsx       # app entry and shell
components/              # ChatInterface, Sidebar, SettingsModal
services/                # geminiService (Gemini image calls)
server/                  # Express proxy server + public interceptors
Dockerfile               # two-stage build: frontend + server image
```

## Notes

- Never commit `.env.local` or a real API key — it is excluded via `.gitignore`. Use `.env.example` as the template and a secrets manager in production.
- No lockfile was included in the original export — the first `npm install` will generate `package-lock.json`; commit that file.
