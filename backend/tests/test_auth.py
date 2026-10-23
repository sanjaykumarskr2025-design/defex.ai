import pytest
from fastapi.testclient import TestClient
from main import app
from database import SessionLocal, Base, engine
from auth import get_password_hash

@pytest.fixture(scope="session")
def db():
    """Create test database."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client():
    """Create test client."""
    return TestClient(app)

def test_register_user(client, db):
    """Test user registration."""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "name": "Test User",
            "password": "TestPassword123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"

def test_register_duplicate_email(client, db):
    """Test duplicate email registration."""
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@example.com",
            "name": "User 1",
            "password": "Password123"
        }
    )

    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@example.com",
            "name": "User 2",
            "password": "Password123"
        }
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"]

def test_login_valid(client, db):
    """Test login with valid credentials."""
    # Register first
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login@example.com",
            "name": "Login Test",
            "password": "LoginPass123"
        }
    )

    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "login@example.com",
            "password": "LoginPass123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_login_invalid_credentials(client, db):
    """Test login with invalid credentials."""
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "nonexistent@example.com",
            "password": "WrongPassword"
        }
    )
    assert response.status_code == 401
