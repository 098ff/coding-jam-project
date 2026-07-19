import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
import os

# Set testing environment variable
os.environ["TESTING"] = "true"

from main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

@patch("main._create_client")
def test_character_flow(mock_create_client):
    # Mock the response from Gemini API
    mock_gemini_client = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "I am a detective. It is rainy outside."
    mock_gemini_client.models.generate_content.return_value = mock_response
    mock_create_client.return_value = mock_gemini_client

    # 1. POST /api/init
    init_data = {
        "name": "Detective Harker",
        "personality": "Cynical detective in a noir film.",
        "forbidden": "happy"
    }
    init_response = client.post("/api/init", json=init_data)
    assert init_response.status_code == 200
    assert init_response.json()["status"] == "initialized"
    
    # 2. POST /api/chat - Happy path (not baiting forbidden word)
    chat_data = {
        "name": "Detective Harker",
        "personality": "Cynical detective in a noir film.",
        "forbidden": "happy",
        "history": [],
        "message": "Hello detective, how is the case?"
    }
    chat_response = client.post("/api/chat", json=chat_data)
    assert chat_response.status_code == 200
    res_json = chat_response.json()
    assert "text" in res_json
    assert res_json["boundary_tested"] is False
    
    # 3. POST /api/chat - Baiting forbidden word
    chat_data_bait = {
        "name": "Detective Harker",
        "personality": "Cynical detective in a noir film.",
        "forbidden": "happy",
        "history": [
            {"role": "user", "text": "Hello detective, how is the case?"},
            {"role": "model", "text": "I am a detective. It is rainy outside."}
        ],
        "message": "Are you happy with this job?"
    }
    chat_response_bait = client.post("/api/chat", json=chat_data_bait)
    assert chat_response_bait.status_code == 200
    res_json_bait = chat_response_bait.json()
    assert "text" in res_json_bait
    # The user baited the word "happy", so boundary_tested should be True
    assert res_json_bait["boundary_tested"] is True

@patch("main._create_client")
def test_character_flow_leaked_forbidden_word(mock_create_client):
    # Mock Gemini generating the forbidden word
    mock_gemini_client = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "This makes me very happy."
    mock_gemini_client.models.generate_content.return_value = mock_response
    mock_create_client.return_value = mock_gemini_client

    chat_data = {
        "name": "Detective Harker",
        "personality": "Cynical detective in a noir film.",
        "forbidden": "happy",
        "history": [],
        "message": "How do you feel?"
    }
    chat_response = client.post("/api/chat", json=chat_data)
    assert chat_response.status_code == 200
    res_json = chat_response.json()
    
    # The backend should have intercepted the response and replaced it
    assert "happy" not in res_json["text"].lower()
    assert res_json["boundary_tested"] is True
