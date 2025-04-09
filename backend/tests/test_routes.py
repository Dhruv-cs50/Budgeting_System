import os
import tempfile
import pytest
from app import app

@pytest.fixture
def client():
    db_fd, temp_path = tempfile.mkstemp()
    app.config['TESTING'] = True
    client = app.test_client()

    yield client
    os.close(db_fd)
    os.unlink(temp_path)

def test_home(client):
    response = client.get('/')
    assert response.status_code in [200, 404]  # Adjust based on your available routes
