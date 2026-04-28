# CSAS: Context-Adaptive Recruitment & Application Profiling System

CSAS (also featuring the Dynamic Contextual Inquiry System - DCIS) is an AI-augmented recruitment platform designed to bridge the semantic gap between applicant resumes and technical job requirements. 

Instead of relying on rigid keyword matching, the system evaluates applications contextually. If a candidate possesses strong baseline skills but lacks specific context, the platform dynamically generates targeted interview questions to assess their true capabilities before a recruiter even reviews the profile.

## Features

### Applicant Portal
* **Job Discovery:** A clean, marketplace-style feed to browse open roles and view detailed job descriptions.
* **AI Resume Parsing (Simulated):** A dedicated dropzone for PDF resumes that features a 6-second simulated NLP pipeline (Tokenization, NER, Vector Embeddings, Cosine Similarity).
* **DCIS Logic Gate:** Smart routing based on resume match scores:
  * **> 90%:** Auto-Shortlisted (Perfect Match)
  * **< 50%:** Auto-Rejected (Poor Match)
  * **50% - 89% (DCIS Zone):** Routed to the Dynamic Inquiry Room to clarify semantic gaps.
* **Dynamic Inquiry Room:** A chat-like interface where candidates answer AI-generated questions to close specific skill gaps.
* **Master-Detail Application History:** A comprehensive record of past applications, displaying a transparent breakdown of visibility scores ($S_{final}$), identified semantic gaps, and read-only inquiry transcripts.

### Recruiter Portal
* **Command Centre:** A high-level overview of platform health, active roles, and candidate funnel metrics.
* **Semantic Role Configuration:** A job posting engine where recruiters define roles and set "Required Capabilities" which act as the ground-truth vector embeddings for the AI.
* **Smart Ranking Board:** An intelligent applicant tracking board that sorts candidates into logical tiers:
  1. Auto-Shortlisted (Bypassed inquiry)
  2. Shortlisted post-inquiry (Sorted by highest $S_{final}$ score)
  3. Inquiry Pending
  4. Rejected
* **Semantic Profile Deep-Dive:** A detailed candidate evaluation view featuring:
  * **Semantic Gap Highlighter:** Visualizing alignment per-requirement.
  * **Inquiry Transcript:** Q&A pairs with response quality scores.
  * **XAI Reasoning Panel:** Plain-language, Explainable AI bullet points justifying the final score.

## Tech Stack
* **Frontend Framework:** React 18
* **Build Tool:** Vite
* **Routing:** React Router DOM (Nested Routing & Route Guards)
* **Styling:** Tailwind CSS (Custom "Minimalist Semantic" Theme)
* **Icons:** Inline SVG Icons

## Getting Started

This template provides a minimal setup to get React working in Vite with HMR.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)