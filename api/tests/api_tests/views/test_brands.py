import pytest
from rest_framework.test import APIClient
from api.models import Brand, User
from api.tests.fixtures import api_client, user, brand, unauthed_client


@pytest.mark.django_db
def test_token_success(api_client, user):
    resp = api_client.post("/login/", {"email": user.email, "password": "testpassword"})
    assert resp.status_code == 200
    assert "access" in resp.data
    assert "refresh" in resp.data


@pytest.mark.django_db
def test_token_error(api_client):
    resp = api_client.post(
        "/login/", {"email": "nonexistent_user@email.com", "password": "foo"}
    )
    assert resp.status_code == 401


def test_brand_list(api_client, brand):
    resp = api_client.get("/api/brand/")
    assert resp.status_code == 200
    assert len(resp.data["results"]) == 1
    assert resp.data["results"][0]["name"] == brand.name


def test_brand_retrieve(api_client, brand):
    resp = api_client.get(f"/api/brand/{brand.id}/")
    assert resp.status_code == 200
    assert resp.data["name"] == brand.name


def test_brand_create_unauthorized(unauthed_client):
    resp = unauthed_client.post("/api/brand/", {"name": "New Brand"})
    assert resp.status_code == 401


def test_brand_create_authorized(api_client):
    resp = api_client.post("/api/brand/", {"name": "New Brand"})
    assert resp.status_code == 201
    assert resp.data["name"] == "New Brand"


def test_brand_partial_update_unauthorized(unauthed_client, brand):
    resp = unauthed_client.patch(f"/api/brand/{brand.id}/", {"name": "Updated Name"})
    assert resp.status_code == 401


def test_brand_partial_update_authorized(api_client, brand):
    resp = api_client.patch(f"/api/brand/{brand.id}/", {"name": "Updated Name"})
    assert resp.status_code == 200
    assert resp.data["name"] == "Updated Name"


def test_brand_full_update_unauthorized(unauthed_client, brand):
    resp = unauthed_client.put(f"/api/brand/{brand.id}/", {"name": "Updated Name"})
    assert resp.status_code == 401


@pytest.mark.django_db
def test_brand_full_update_authorized():
    # create a user and authenticate
    user = User.objects.create_user(email="testuser1234@email.com", password="testpass")
    client = APIClient()
    client.force_authenticate(user=user)

    # create a brand to update
    brand = Brand.objects.create(name="Test Brand")

    # update the brand
    data = {"name": "New Brand Name"}
    response = client.put(f"/api/brand/{brand.id}/", data)

    # assert the response
    assert response.status_code == 200
    assert response.data["name"] == "New Brand Name"
