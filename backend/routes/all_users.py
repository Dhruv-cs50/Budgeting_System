"""
all_users.py

This module defines routes for handling user data in the budgeting application.
It provides endpoints for retrieving all user data and adding a new user to the JSON-based database.
"""

from flask import Blueprint, jsonify, request
import json
import os
from datetime import datetime

all_users_bp = Blueprint('all_users', __name__, url_prefix='/api/data')

# Path to your JSON file acting as the "database"
DATA_FILE = 'data.json'

# Ensure the file exists
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

@all_users_bp.route('', methods=['GET'])
def get_data():
    """
    GET /api/data
    Retrieves all users data from the JSON file and returns it as a JSON response.
    """
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)
    return jsonify(data), 200