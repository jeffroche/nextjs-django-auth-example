import pytest
from rest_framework.test import APIClient
from api.models import User
from django.contrib.auth.hashers import make_password


@pytest.fixture
def api_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.fixture
def unauthed_client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create(
        email="test@example.com",
        password=make_password("testpassword"),
    )
