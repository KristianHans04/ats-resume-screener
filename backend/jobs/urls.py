from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobDescriptionViewSet

router = DefaultRouter()
router.register(r'', JobDescriptionViewSet, basename='jobs')

urlpatterns = [
    path('', include(router.urls)),
]
