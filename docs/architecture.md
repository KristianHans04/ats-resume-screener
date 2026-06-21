# System Architecture Overview

This document provides a high-level overview of the CSAS Engine's technical architecture. It explains how the different parts of the system communicate with each other to deliver the final product.

## The Client-Server Model
The application follows a modern, decoupled client-server architecture. This means the visual interface the user interacts with (the frontend) is entirely separate from the logic and data storage (the backend). They communicate over the internet using an Application Programming Interface (API).

## Technology Stack

### 1. The Frontend (Client)
- **Framework:** React 18, utilizing Vite as the build tool for fast performance.
- **Role:** It is responsible for rendering the User Interface (UI). It handles user interactions, displays forms, manages the dashboard views for Candidates and Recruiters, and visually presents the AI's analysis.
- **Routing:** Uses React Router to handle navigation (e.g., preventing candidates from viewing recruiter pages).

### 2. The Backend (Serverless API)
- **Environment:** Cloudflare Pages Functions.
- **Role:** The backend acts as the brain of the operation. It receives requests from the frontend, enforces security rules, processes data, communicates with the database, and reaches out to external Artificial Intelligence providers.
- **Serverless Architecture:** Instead of running a traditional server that is always "on," the backend uses "Functions." These are small scripts that run on-demand only when a user makes a request, making the system highly scalable and cost-efficient.

### 3. The Database (Storage)
- **Engine:** Cloudflare D1 (A serverless SQL database).
- **Role:** It permanently stores all application data, including user accounts, job postings, application statuses, and the AI-generated interview transcripts.

### 4. The AI Providers (Intelligence)
- **Engines:** OpenRouter and Google Gemini APIs.
- **Role:** The system communicates with external Large Language Models (LLMs) to perform the semantic reading of resumes, generate dynamic interview questions, and calculate candidate scores.

## The Standard Data Flow
When a user performs an action, the data follows a specific path:
1. **User Action:** A candidate uploads a resume and clicks "Apply" on the React frontend.
2. **API Request:** The frontend packages this document and sends an HTTP POST request to the backend.
3. **Backend Processing:** A Cloudflare Function receives the request. It verifies the user is logged in, then extracts the resume text.
4. **AI Orchestration:** The backend function sends the resume text and the job description to the AI Provider over a secure connection.
5. **Database Update:** The AI returns its analysis (score, gaps, questions). The backend saves this exact analysis into the Cloudflare D1 Database.
6. **Response:** The backend sends a success message back to the frontend.
7. **UI Update:** The React frontend updates the candidate's dashboard to show their new application status.
