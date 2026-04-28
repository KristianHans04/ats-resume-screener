from rest_framework import serializers
from .models import JobDescription, CandidateApplication

class JobDescriptionSerializer(serializers.ModelSerializer):
    recruiter = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = JobDescription
        fields = ('id', 'title', 'company', 'description', 'recruiter', 'created_at')

    def create(self, validated_data):
        validated_data['recruiter'] = self.context['request'].user
        return super().create(validated_data)

class CandidateApplicationSerializer(serializers.ModelSerializer):
    candidate = serializers.StringRelatedField(read_only=True)
    job = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = CandidateApplication
        fields = ('id', 'job', 'candidate', 'resume', 'status', 'ai_score', 'semantic_gaps', 'generated_questions', 'answers', 'created_at', 'updated_at')

