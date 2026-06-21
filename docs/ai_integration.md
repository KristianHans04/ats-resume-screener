# AI Integration and Logic

The CSAS Engine's true power lies in its AI integration, managed entirely within the backend's `functions/lib/ai.js` file. This document explains how the system communicates with external AI models and the logic it uses to enforce consistent results.

## The Provider Fallback System
To ensure maximum reliability, the platform is configured to use multiple AI providers. 
When the system needs an AI analysis, it does not rely on just one service:
1. **Primary Provider:** It first attempts to send the request to OpenRouter (using their free-tier models).
2. **Secondary Provider (Fallback):** If OpenRouter fails, is too busy, or returns an error, the system automatically catches the failure and immediately reroutes the request to Google's Gemini AI API.
This fallback mechanism ensures that candidates are never stuck waiting due to a third-party server outage.

## The AI Prompts
The backend communicates with the AI using strictly structured text instructions called "Prompts." The system executes two main prompts during a candidate's lifecycle.

### Prompt 1: The Initial Resume Analysis
When a candidate uploads a resume, the backend sends the AI the Job Description, the Resume Text, and a massive instruction manual.
The instructions force the AI to:
- Act as an expert technical recruiter.
- Categorize the resume into a strict bucket (`STRONG`, `UNDEREXPLAINED`, `REJECTED`).
- If the candidate is a good fit, generate a list of "Semantic Gaps" (missing skills).
- Generate exactly three custom interview questions to address those gaps.

**Enforcing Structure:** LLMs are prone to returning messy, unpredictable text. The backend prompt explicitly commands the AI to return its analysis in a strict JSON (JavaScript Object Notation) format. This guarantees that the backend can programmatically extract the score, gaps, and questions and save them cleanly into the database.

### Prompt 2: The Answer Evaluation
Once a candidate answers the dynamic questions, a second prompt is executed.
The backend sends the AI: The Job Description, the Questions Asked, the Candidate's Answers, and their Current Score.
The instructions force the AI to:
- Evaluate the answers for depth, relevance, and proof of experience.
- Decide whether to increase, decrease, or maintain the candidate's score based on their responses.
- Provide a brief "feedback" sentence (XAI - Explainable AI) explaining why it scored the answer a certain way.

## Data Validation
Even with strict prompts, AI can sometimes make formatting mistakes. 
Before any AI response is saved to the database, the backend runs it through a "Validation Function." 
- If the AI accidentally returned a score of 150, the validation function forces it down to the maximum of 100.
- If the AI failed to generate questions, the validation function creates empty placeholders to prevent the application from crashing.
This safety layer ensures that no matter how the AI behaves, the CSAS Engine database remains perfectly stable and uncorrupted.
