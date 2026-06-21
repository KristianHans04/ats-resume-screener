# CSAS Engine: Context-Adaptive Semantic Application Screening

## Project Overview
The CSAS Engine is an advanced, full-stack Applicant Tracking System (ATS) that replaces rigid keyword-matching with Context-Adaptive Semantic Screening. By utilizing artificial intelligence, the platform reads candidate resumes for actual meaning and dynamically generates customized interview questions to clarify missing skills, creating a fairer hiring process and providing recruiters with deeply vetted applicant profiles.

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