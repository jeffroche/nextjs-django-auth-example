from api.models import Coffee

from api.tests.fixtures import user, api_client, unauthed_client, coffee, brand


def test_coffee_model(db, coffee):
    assert isinstance(coffee, Coffee)
    assert coffee.__str__() == f"{coffee.name} - {coffee.brand.name}"


def test_coffee_viewset_list(db, api_client, coffee):
    response = api_client.get("/api/coffee/")
    assert response.status_code == 200
    assert response.data["results"][0]["name"] == coffee.name


def test_coffee_viewset_retrieve(db, api_client, coffee):
    response = api_client.get(f"/api/coffee/{coffee.id}/")
    assert response.status_code == 200
    assert response.data["name"] == coffee.name


def test_brand_viewset_create_unauthorized(db, unauthed_client):
    response = unauthed_client.post("/api/coffee/", {"name": "New Brand"})
    assert response.status_code == 401
