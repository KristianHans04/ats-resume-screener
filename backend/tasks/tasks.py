import logging
import json
import os
import pypdf
import google.generativeai as genai
from celery import shared_task
from django.conf import settings
from utils.mongodb_utils import MongoDBUtility
from jobs.models import CandidateApplication

logger = logging.getLogger(__name__)

# Configure Gemini
api_key = os.environ.get('GEMINI_API_KEY')
if api_key:
    genai.configure(api_key=api_key)

@shared_task
def process_resume_task(application_id):
    try:
        application = CandidateApplication.objects.get(id=application_id)
        
        application.status = CandidateApplication.Status.PARSING
        application.save(update_fields=['status'])

        raw_text = ""
        resume_file = application.resume
        if resume_file:
            try:
                resume_file.open('rb')
                reader = pypdf.PdfReader(resume_file)
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        raw_text += text + "\n"
            except Exception as e:
                logger.error(f"Failed to parse PDF for application {application_id}: {str(e)}")
                raise e
            finally:
                resume_file.close()

        mongo_util = MongoDBUtility()
        mongo_util.save_cv_text(candidate_id=application.candidate.id, raw_text=raw_text)
        mongo_util.close()

        # Call Gemini
        if not api_key:
            raise Exception("GEMINI_API_KEY not configured")

        # use gemini-1.5-flash for speed or gemini-2.5-pro for reasoning
        model = genai.GenerativeModel("gemini-2.5-pro")
        
        job_desc = application.job.description
        
        prompt = f"""
        You are an expert technical recruiter. You need to analyze the following candidate's CV against the Job Description.
        
        Job Description:
        {job_desc}
        
        Candidate CV:
        {raw_text}
        
        Output valid JSON with exactly the following structure:
        {{
            "score": <float between 0-100 indicating match>,
            "semantic_gaps": [
                {{"skill": "<gap skill name>", "similarity": <float between 0-1>}}
            ],
            "generated_questions": [
                {{"id": "q1", "role": "system", "gap": "<gap skill name>", "text": "<question text>"}}
            ]
        }}
        Generate at most 2 questions for the most critical semantic gaps.
        Make sure the response is valid JSON. Do not include markdown blocks like ```json .
        """
        
        response = model.generate_content(prompt)
        text_response = response.text.strip()
        if text_response.startswith('```json'):
            text_response = text_response[7:-3].strip()
        elif text_response.startswith('```'):
            text_response = text_response[3:-3].strip()
            
        data = json.loads(text_response)
        
        application.ai_score = data.get('score', 0)
        application.semantic_gaps = data.get('semantic_gaps', [])
        application.generated_questions = data.get('generated_questions', [])
        
        # Determine status based on score / gaps
        if application.generated_questions:
            application.status = CandidateApplication.Status.AWAITING_INQUIRY
        else:
            application.status = CandidateApplication.Status.COMPLETED

        application.save(update_fields=['ai_score', 'semantic_gaps', 'generated_questions', 'status'])
        
        return {"status": "completed", "application_id": application_id}

    except Exception as e:
        logger.exception(f"Exception during AI process for application {application_id}")
        if 'application' in locals():
            application.status = CandidateApplication.Status.FAILED
            application.save(update_fields=['status'])
        return {"status": "failed", "error": str(e)}

@shared_task
def evaluate_answers_task(application_id):
    try:
        application = CandidateApplication.objects.get(id=application_id)
        
        application.status = CandidateApplication.Status.EVALUATING
        application.save(update_fields=['status'])
        
        if not api_key:
            raise Exception("GEMINI_API_KEY not configured")

        model = genai.GenerativeModel("gemini-2.5-pro")
        
        job_desc = application.job.description
        questions = json.dumps(application.generated_questions)
        answers = json.dumps(application.answers)
        
        prompt = f"""
        You are an expert technical recruiter evaluating a candidate's answers to specific technical questions meant to fill gaps in their CV.
        
        Job Description:
        {job_desc}
        
        Questions Asked:
        {questions}
        
        Candidate's Answers:
        {answers}
        
        Current Resume Score: {application.ai_score}
        
        Based on the candidate's answers, evaluate their competence regarding the gaps. 
        Adjust their score appropriately (up or down) between 0 and 100.
        
        Output valid JSON with exactly the following structure:
        {{
            "adjusted_score": <float between 0-100>
        }}
        Do not include markdown blocks like ```json .
        """
        
        response = model.generate_content(prompt)
        text_response = response.text.strip()
        if text_response.startswith('```json'):
            text_response = text_response[7:-3].strip()
        elif text_response.startswith('```'):
            text_response = text_response[3:-3].strip()
            
        data = json.loads(text_response)
        
        application.ai_score = data.get('adjusted_score', application.ai_score)
        application.status = CandidateApplication.Status.COMPLETED
        application.save(update_fields=['ai_score', 'status'])
        
        return {"status": "completed", "application_id": application_id, "new_score": application.ai_score}
        
    except Exception as e:
        logger.exception(f"Exception during AI evaluation for application {application_id}")
        if 'application' in locals():
            application.status = CandidateApplication.Status.FAILED
            application.save(update_fields=['status'])
        return {"status": "failed", "error": str(e)}
