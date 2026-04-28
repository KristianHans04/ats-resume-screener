from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobDescriptionViewSet, CandidateApplicationViewSet

router = DefaultRouter()
router.register(r'jobs', JobDescriptionViewSet, basename='jobs')
router.register(r'applications', CandidateApplicationViewSet, basename='applications')

urlpatterns = [
    path('', include(router.urls)),
]
