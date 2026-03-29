import logging
import random
import pypdf
from celery import shared_task
from utils.mongodb_utils import MongoDBUtility
from jobs.models import CandidateApplication

logger = logging.getLogger(__name__)

@shared_task
def process_resume_task(application_id):
    """
    Extracts text from an uploaded resume and saves it to MongoDB,
    then generates an AI matching score and updates the application status.
    """
    try:
        application = CandidateApplication.objects.get(id=application_id)
        
        # 1. Update status to PARSING
        application.status = CandidateApplication.Status.PARSING
        application.save(update_fields=['status'])

        # 2. Extract Text
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

        # 3. Dump Raw Text to MongoDB
        mongo_util = MongoDBUtility()
        mongo_util.save_cv_text(candidate_id=application.candidate.id, raw_text=raw_text)
        mongo_util.close()

        # 4. Generate Score (Dummy scoring for now)
        # TODO: Replace with real AI scoring/Mistral API call using the extracted raw_text
        ai_score = round(random.uniform(55.0, 98.0), 2)

        # 5. Update application with new score
        application.ai_score = ai_score
        application.status = CandidateApplication.Status.SCORED
        application.save(update_fields=['ai_score', 'status'])
        
        return {"status": "completed", "application_id": application_id, "score": ai_score}

    except CandidateApplication.DoesNotExist:
        logger.error(f"Application {application_id} not found.")
        return {"status": "failed", "error": "Application not found"}
        
    except Exception as e:
        logger.exception(f"Exception during AI process for application {application_id}")
        if 'application' in locals():
            application.status = CandidateApplication.Status.FAILED
            application.save(update_fields=['status'])
        return {"status": "failed", "error": str(e)}

@shared_task
def simulate_ai_process(duration=10):
    """
    Simulates a long-running AI process like semantic gap analysis.
    """
    import time
    print(f"Starting simulated AI process for {duration} seconds...")
    time.sleep(duration)
    print("Simulated AI process completed.")
    return {"status": "completed", "result": "AI analysis complete"}
