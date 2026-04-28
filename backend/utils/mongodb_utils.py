import os
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class MongoDBUtility:
    """
    Utility class to interact with MongoDB for raw text storage.
    Gracefully degrades when MongoDB is not available.
    """
    def __init__(self):
        self.uri = getattr(settings, 'MONGO_URI', '')
        self.client = None
        self.collection = None

        if not self.uri:
            logger.info("MONGO_URI not configured — MongoDB storage disabled")
            return

        try:
            from pymongo import MongoClient
            self.client = MongoClient(self.uri, serverSelectionTimeoutMS=3000)
            self.client.server_info()
            self.db_name = getattr(settings, 'MONGO_DB_NAME', 'dcis_raw_data')
            self.db = self.client[self.db_name]
            self.collection = self.db["candidate_cvs"]
        except Exception as e:
            logger.warning(f"MongoDB not available: {e} — CV text will not be stored in MongoDB")
            self.client = None
            self.collection = None

    def save_cv_text(self, candidate_id, raw_text):
        if not self.collection:
            return False
        try:
            data = {
                "candidate_id": candidate_id,
                "raw_text": raw_text,
                "last_updated": settings.TIME_ZONE
            }
            result = self.collection.update_one(
                {"candidate_id": candidate_id},
                {"$set": data},
                upsert=True
            )
            return result.acknowledged
        except Exception as e:
            logger.warning(f"Failed to save CV text to MongoDB: {e}")
            return False

    def get_cv_text(self, candidate_id):
        if not self.collection:
            return None
        try:
            doc = self.collection.find_one({"candidate_id": candidate_id})
            return doc["raw_text"] if doc else None
        except Exception as e:
            logger.warning(f"Failed to get CV text from MongoDB: {e}")
            return None

    def close(self):
        if self.client:
            self.client.close()
