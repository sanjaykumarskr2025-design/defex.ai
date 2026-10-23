def test_health_check():
    """Test API health endpoint."""
    from main import app
    from fastapi.testclient import TestClient

    client = TestClient(app)
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_root_endpoint():
    """Test root endpoint returns app info."""
    from main import app
    from fastapi.testclient import TestClient

    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "DefEx.ai"
    assert "version" in data
