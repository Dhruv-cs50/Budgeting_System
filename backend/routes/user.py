"""
user.py

This module defines routes for handling individual user data in the budgeting application.
It provides endpoints for retrieving all user data and adding a new user to the JSON-based database.
"""

from flask import Blueprint, jsonify, request
import json
import os
from datetime import datetime

user_bp = Blueprint('user', __name__, url_prefix='/api/data')

# Path to your JSON file acting as the "database"
DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'data.json')
DATA_FILE = os.path.abspath(DATA_FILE)

# Ensure the file exists
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

@user_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """
    GET /api/data/<user_id>
    Retrieves a specific user's data from the JSON database based on user_id.

    @param user_id - The ID of the user to retrieve.
    @return JSON user data or 404 error if not found.
    """
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    for user in data:
        if user["user_id"] == user_id:
            return jsonify(user), 200

    return jsonify({"message": "User not found."}), 404


@user_bp.route('', methods=['POST'])
def add_user():
    """
    POST /api/data
    Adds a new user entry to the JSON database. The request must include a JSON body
    with the following fields:

    {
        "timestamp": "2024-06-08T15:30:00Z",
        "fullName": "Oliver",
        "email": "oliver@example.com",
        "dateOfBirth": "1998-05-15",
        "occupation": "Engineer",
        "monthlyIncome": 6000.00,
        "phoneNumber": "321-654-0987",
        "preferredCurrency": "USD",
        "language": "English",
        "currentBalance": 134235.24,
        "totalMonthlyBudget": 5000.00
    }

    The function automatically assigns a user_id and a current timestamp to the new user.
    """
    new_entry = request.json
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    new_entry['userId'] = len(data)
    new_entry['timestamp'] = datetime.now().isoformat()
    data.append(new_entry)

    with open(DATA_FILE, 'w') as f:
        print('Writing to:', DATA_FILE)
        json.dump(data, f, indent=4)

    return jsonify({'message': 'Data added successfully'}), 201