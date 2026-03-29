from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import JobDescription, CandidateApplication
from .serializers import JobDescriptionSerializer, CandidateApplicationSerializer
from .permissions import IsRecruiter

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
            # TODO: Trigger Celery task here in the future
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
