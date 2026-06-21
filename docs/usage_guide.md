# Platform Usage Guide

This document outlines the operational flows for the two primary user roles within the CSAS Engine.

## The Candidate Flow

1. **Registration and Access:**
   - The user accesses the platform and selects the 'Candidate' role during registration.
   - Upon logging in, they are routed to the Candidate Dashboard.

2. **Job Discovery:**
   - The Dashboard displays a marketplace feed of active job postings.
   - Candidates can review Job Cards containing critical metadata (Title, Company, Location, Description).

3. **Application Submission:**
   - The candidate selects a specific role and initiates the application process.
   - The user uploads their resume document (e.g., PDF) via the designated dropzone.
   - The frontend transmits the document to the backend for immediate Semantic Analysis.

4. **Dynamic Inquiry Phase:**
   - If the AI engine flags the application as "Underexplained," the application status updates to "Pending Inquiry."
   - The candidate enters the Dynamic Inquiry Room interface.
   - They are presented with up to three custom questions addressing specific semantic gaps identified by the AI.
   - The candidate submits detailed textual answers.

5. **Completion:**
   - Following the submission of answers, the application status transitions to "Completed."
   - The candidate's involvement is concluded, and they await off-platform contact from the recruiter.

---

## The Recruiter Flow

1. **System Access:**
   - The user registers and logs in with the 'Recruiter' role, granting access to the Command Center.

2. **Job Configuration:**
   - From the Command Center, the recruiter creates a new job posting.
   - Crucially, they define the specific "Requirements and Responsibilities." This text serves as the grounding data for the AI's semantic evaluations.
   - The job is published and becomes visible on the Candidate marketplace.

3. **Pipeline Management (Smart Ranking Board):**
   - The recruiter accesses a specific job to view its applicant pool.
   - Candidates are pre-sorted into tiers:
     - **Shortlisted:** Completed applications ranked by AI score.
     - **Inquiry Pending:** Applications currently undergoing the dynamic Q&A phase.
     - **Rejected:** Applications auto-discarded due to extreme irrelevance or invalid file types.

4. **Semantic Profile Review:**
   - The recruiter selects a Shortlisted candidate to view their Semantic Profile.
   - They review the Overall Match Score.
   - They analyze the Semantic Gap Highlighter to visually assess proven skills vs. missing skills.
   - They read the Inquiry Transcript to evaluate the candidate's answers to the AI's questions.
   - They review the XAI (Explainable AI) summary panel to understand the system's reasoning for the final score.

5. **Decision Execution:**
   - Utilizing the comprehensive data provided, the recruiter determines whether to initiate off-platform contact for a formal interview.
