from rest_framework import serializers
from .models import JobDescription

class JobDescriptionSerializer(serializers.ModelSerializer):
    recruiter = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = JobDescription
        fields = ('id', 'title', 'company', 'description', 'recruiter', 'created_at')

    def create(self, validated_data):
        validated_data['recruiter'] = self.context['request'].user
        return super().create(validated_data)
