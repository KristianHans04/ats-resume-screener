# CARAPS: Context-Adaptive Recruitment & Application Profiling System

## Project Overview
CARAPS (featuring the Dynamic Contextual Inquiry System - DCIS) is an advanced, full-stack, AI-augmented recruitment platform designed to bridge the semantic gap between applicant resumes and technical job requirements. 

Instead of relying on rigid keyword matching, the system evaluates applications contextually. If a candidate possesses strong baseline skills but lacks specific context, the platform dynamically generates targeted interview questions to assess their true capabilities before a recruiter even reviews the profile.

## Architecture & Tech Stack
This project utilizes a modern, serverless architecture:
- **Frontend:** React 18, Vite, React Router, Tailwind CSS.
- **Backend:** Cloudflare Pages Functions (Serverless File-Based Routing).
- **Database:** Cloudflare D1 (Serverless SQLite).
- **Storage:** Cloudflare R2 (Document storage).
- **AI Integration:** Multi-provider fallback system utilizing OpenRouter and Google Gemini APIs.

## Comprehensive Documentation
For a complete, in-depth understanding of how this project functions technically and operationally, please review the files in the `docs/` directory:

- [System Architecture](docs/architecture.md) - High-level design, client-server model, and data flow.
- [Frontend Mechanics](docs/frontend.md) - React component structure, protected routing, and state management.
- [Backend Mechanics](docs/backend.md) - Cloudflare Functions, middleware security, and endpoint logic.
- [Database Schema](docs/database.md) - D1 SQLite table structures and relational data mapping.
- [AI Integration](docs/ai_integration.md) - Prompt design, provider fallback logic, and JSON validation.
- [Platform Usage Guide](docs/usage_guide.md) - The end-to-end operational flows for Candidates and Recruiters.

## Local Development Setup

### Prerequisites
- Node.js installed on your local machine.
- Cloudflare Wrangler CLI.

### Installation
1. Install project dependencies:
   ```bash
   npm install
   cd frontend && npm install
   cd ..
   ```

2. Initialize and Seed the Database:
   ```bash
   npm run db:init
   npm run db:seed
   ```

3. Environment Variables:
   Ensure you have a `.env` file configured in the root directory with your AI Provider keys (e.g., `OPENROUTER_API_KEY`, `GOOGLE_AI_API_KEY`) and `JWT_SECRET`.

4. Start the Development Server:
   ```bash
   npm run dev
   ```
   This command uses `concurrently` to launch both the Vite frontend server and the Wrangler backend API server simultaneously.

---
*Built to redefine recruitment through intelligent semantic analysis.*