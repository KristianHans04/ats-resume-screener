from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from celery.result import AsyncResult

class TaskStatusView(APIView):
    def get(self, request, task_id):
        """
        Retrieves the status of a background task.
        """
        res = AsyncResult(task_id)
        return Response({
            "task_id": task_id,
            "status": res.status,
            "result": res.result if res.ready() else None
        }, status=status.HTTP_200_OK)
