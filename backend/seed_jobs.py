import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dcis_backend.settings')
django.setup()

from users.models import User
from jobs.models import JobDescription

def seed_jobs():
    # 1. Get or create a recruiter
    recruiter, created = User.objects.get_or_create(
        username='recruiter_test',
        defaults={
            'email': 'recruiter@example.com',
            'role': User.Role.RECRUITER
        }
    )
    if created:
        recruiter.set_password('testpass123')
        recruiter.save()
        print(f"Created test recruiter: {recruiter.username}")
    else:
        print(f"Using existing recruiter: {recruiter.username}")

    # 2. Sample Jobs Data
    jobs_data = [
        {
            "title": "Senior Full-Stack Engineer",
            "company": "TechVision AI",
            "department": "Engineering",
            "location": "Nairobi, Kenya (Hybrid)",
            "employment_type": "Full-time",
            "salary": "KES 350k - 500k",
            "description": "We are looking for a Senior Full-Stack Engineer to lead our core platform development. You will work with React, Django, and PostgreSQL to build scalable AI-driven solutions.",
            "requirements": "• 5+ years of experience with React and Python/Django\n• Experience with cloud infrastructure (AWS/GCP)\n• Strong understanding of system design and architecture",
            "responsibilities": "• Lead the development of new features and microservices\n• Mentor junior developers and conduct code reviews\n• Optimize application performance and scalability"
        },
        {
            "title": "Junior Data Scientist",
            "company": "DataPulse Analytics",
            "department": "Data Science",
            "location": "Remote",
            "employment_type": "Contract",
            "salary": "KES 150k - 200k",
            "description": "Join our growing data team to help build predictive models for our fintech clients. This is a great opportunity for a junior scientist to work with large-scale datasets.",
            "requirements": "• Degree in Computer Science, Math, or related field\n• Proficiency in Python, SQL, and Pandas\n• Familiarity with Scikit-learn or TensorFlow",
            "responsibilities": "• Clean and preprocess raw data for model training\n• Assist in developing and testing ML models\n• Create visualizations and reports for stakeholders"
        },
        {
            "title": "UI/UX Designer",
            "company": "CreativeFlow Studio",
            "department": "Design",
            "location": "Mombasa, Kenya",
            "employment_type": "Full-time",
            "salary": "Negotiable",
            "description": "We need a creative UI/UX Designer to craft beautiful and intuitive user experiences for our client's mobile and web applications.",
            "requirements": "• Proven portfolio of UI/UX design work\n• Proficiency in Figma, Adobe XD, or Sketch\n• Strong understanding of typography and color theory",
            "responsibilities": "• Create wireframes, prototypes, and high-fidelity designs\n• Conduct user research and usability testing\n• Collaborate with developers to ensure design fidelity"
        }
    ]

    # 3. Create the jobs
    for job_info in jobs_data:
        job, created = JobDescription.objects.get_or_create(
            title=job_info['title'],
            company=job_info['company'],
            recruiter=recruiter,
            defaults=job_info
        )
        if created:
            print(f"Created job: {job.title} at {job.company}")
        else:
            print(f"Job already exists: {job.title}")

if __name__ == "__main__":
    seed_jobs()
    print("Seeding complete!")
