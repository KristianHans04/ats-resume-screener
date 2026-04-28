from rest_framework import serializers
from .models import JobDescription, CandidateApplication

class JobDescriptionSerializer(serializers.ModelSerializer):
    recruiter = serializers.StringRelatedField(read_only=True)
    application_status = serializers.SerializerMethodField()
    application_id = serializers.SerializerMethodField()

    class Meta:
        model = JobDescription
        fields = ('id', 'title', 'company', 'department', 'location', 'employment_type', 'salary', 'description', 'requirements', 'responsibilities', 'recruiter', 'created_at', 'application_status', 'application_id')

    def get_application_status(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from .models import CandidateApplication
            app = CandidateApplication.objects.filter(job=obj, candidate=request.user).first()
            return app.status if app else None
        return None

    def get_application_id(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from .models import CandidateApplication
            app = CandidateApplication.objects.filter(job=obj, candidate=request.user).first()
            return app.id if app else None
        return None

    def create(self, validated_data):
        validated_data['recruiter'] = self.context['request'].user
        return super().create(validated_data)

class CandidateApplicationSerializer(serializers.ModelSerializer):
    candidate = serializers.StringRelatedField(read_only=True)
    job_title = serializers.ReadOnlyField(source='job.title')
    company_name = serializers.ReadOnlyField(source='job.company')

    class Meta:
        model = CandidateApplication
        fields = ('id', 'job', 'job_title', 'company_name', 'candidate', 'resume', 'status', 'ai_score', 'semantic_gaps', 'generated_questions', 'answers', 'created_at', 'updated_at')

