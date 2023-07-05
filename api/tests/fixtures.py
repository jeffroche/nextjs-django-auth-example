import pytest
from rest_framework.test import APIClient
from api.models import Brand, Coffee, User
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


@pytest.fixture
def brand(db):
    return Brand.objects.create(name="Test Brand")


@pytest.fixture
def coffee(db, brand):
    return Coffee.objects.create(name="Test Coffee", brand=brand)


@pytest.fixture
def user_favorite(db, user, brand):
    return User.brands.through.objects.create(user=user, brand=brand)


@pytest.fixture
def brand_favorite(db, brand):
    return Brand.users.through.objects.create(brand=brand)


@pytest.fixture
def user_brand(db, user, brand):
    brand.users.add(user)
    return brand
