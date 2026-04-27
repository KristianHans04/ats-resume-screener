from django.contrib import admin
from .models import JobDescription, CandidateApplication

@admin.register(JobDescription)
class JobDescriptionAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'recruiter', 'created_at')

@admin.register(CandidateApplication)
class CandidateApplicationAdmin(admin.ModelAdmin):
    list_display = ('job', 'candidate', 'status', 'ai_score', 'created_at')
