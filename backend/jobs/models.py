from django.db import models
from django.conf import settings

class JobDescription(models.Model):
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    department = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    employment_type = models.CharField(max_length=100, blank=True, null=True)
    salary = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField()
    requirements = models.TextField(blank=True, null=True)
    responsibilities = models.TextField(blank=True, null=True)
    recruiter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='jobs'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company}"

class CandidateApplication(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PARSING = 'PARSING', 'Parsing'
        AWAITING_INQUIRY = 'AWAITING_INQUIRY', 'Awaiting Inquiry'
        EVALUATING = 'EVALUATING', 'Evaluating'
        SCORED = 'SCORED', 'Scored'
        COMPLETED = 'COMPLETED', 'Completed'
        SHORTLISTED = 'SHORTLISTED', 'Shortlisted'
        REJECTED = 'REJECTED', 'Rejected'
        FAILED = 'FAILED', 'Failed'

    job = models.ForeignKey(
        JobDescription,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    resume = models.FileField(upload_to='resumes/%Y/%m/%d/')
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    ai_score = models.FloatField(null=True, blank=True)
    semantic_gaps = models.JSONField(null=True, blank=True)
    generated_questions = models.JSONField(null=True, blank=True)
    answers = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('job', 'candidate')
        ordering = ['-ai_score', '-created_at']

    def __str__(self):
        return f"Application by {self.candidate} for {self.job.title}"
