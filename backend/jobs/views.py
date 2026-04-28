from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import JobDescription, CandidateApplication
from .serializers import JobDescriptionSerializer, CandidateApplicationSerializer
from .permissions import IsRecruiter
from tasks.tasks import process_resume_task, evaluate_answers_task

class CandidateApplicationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CandidateApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'CANDIDATE':
            return CandidateApplication.objects.filter(candidate=user)
        elif user.role == 'RECRUITER':
            return CandidateApplication.objects.filter(job__recruiter=user)
        return CandidateApplication.objects.none()

    @action(detail=True, methods=['post'])
    def submit_answers(self, request, pk=None):
        application = self.get_object()
        user = request.user

        if user.role != 'CANDIDATE':
            return Response({"error": "Only candidates can submit answers."}, status=status.HTTP_403_FORBIDDEN)

        if application.status != CandidateApplication.Status.AWAITING_INQUIRY:
            return Response({"error": "This application is not awaiting inquiry answers."}, status=status.HTTP_400_BAD_REQUEST)

        answers = request.data.get('answers')
        if not answers:
            return Response({"error": "No answers provided."}, status=status.HTTP_400_BAD_REQUEST)

        application.answers = answers
        application.save(update_fields=['answers'])

        # Dispatch evaluation task
        evaluate_answers_task.delay(application.id)
        
        return Response({"status": "Answers submitted and evaluation started."}, status=status.HTTP_200_OK)

class JobDescriptionViewSet(viewsets.ModelViewSet):
    queryset = JobDescription.objects.all()
    serializer_class = JobDescriptionSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsRecruiter]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def apply(self, request, pk=None):
        job = self.get_object()
        user = request.user

        if user.role != 'CANDIDATE':
            return Response({"error": "Only candidates can apply to jobs."}, status=status.HTTP_403_FORBIDDEN)

        if CandidateApplication.objects.filter(job=job, candidate=user).exists():
            return Response({"error": "You have already applied for this job."}, status=status.HTTP_400_BAD_REQUEST)

        # Handle FormData for file upload
        if 'resume' not in request.FILES:
            return Response({"error": "No resume file provided."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CandidateApplicationSerializer(data=request.data)
        if serializer.is_valid():
            application = serializer.save(job=job, candidate=user)
            # Dispatch the parsing and scoring task to Celery
            process_resume_task.delay(application.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated, IsRecruiter])
    def applications(self, request, pk=None):
        job = self.get_object()
        if job.recruiter != request.user:
            return Response({"error": "You can only view applications for jobs you created."}, status=status.HTTP_403_FORBIDDEN)

        applications = job.applications.all()
        serializer = CandidateApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

