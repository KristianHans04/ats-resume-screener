import os
from pymongo import MongoClient
from django.conf import settings

class MongoDBUtility:
    """
    Utility class to interact with MongoDB for raw text storage.
    """
    def __init__(self):
        # In a real app, use environment variables or settings
        self.uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
        self.client = MongoClient(self.uri)
        self.db = self.client["dcis_raw_data"]
        self.collection = self.db["candidate_cvs"]

    def save_cv_text(self, candidate_id, raw_text):
        """
        Saves or updates raw CV text for a candidate.
        """
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

    def get_cv_text(self, candidate_id):
        """
        Retrieves raw CV text by candidate_id.
        """
        doc = self.collection.find_one({"candidate_id": candidate_id})
        return doc["raw_text"] if doc else None

    def close(self):
        self.client.close()
