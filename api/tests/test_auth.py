import json
from rest_framework import status
from api.tests.fixtures import unauthed_client, user


def test_login_success(db, unauthed_client, user):
    # create a test user payload
    user_data = {
        "email": user.email,
        "password": "testpassword",
    }
    response = unauthed_client.post("/login/", data=user_data)
    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.data
    assert "refresh" in response.data


def test_login_failure(db, unauthed_client, user):
    # create a test user payload
    user_data = {
        "email": "badEmail@bad.com",
        "password": "pwcruddy",
    }
    response = unauthed_client.post("/login/", data=user_data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data["detail"].code == "no_active_account"


def test_register_endpoint(db, unauthed_client):
    # create a test user payload
    user_data = {
        "email": "testuser1234@email.com",
        "password": "password123",
    }

    # perform a POST request to the register endpoint
    response = unauthed_client.post(
        "/register/", data=json.dumps(user_data), content_type="application/json"
    )

    # assert that the response status code is HTTP 200 OK
    assert response.status_code == status.HTTP_201_CREATED

    # assert that the response contains the access and refresh tokens
    assert "access" in response.data["tokens"]
    assert "refresh" in response.data["tokens"]
