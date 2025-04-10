from flask import Blueprint, jsonify, request
import json
import os
from datetime import datetime

user_bp = Blueprint('users', __name__, url_prefix='/api/data')

# Path to your JSON file acting as the "database"
DATA_FILE = 'data.json'

# Ensure the file exists
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

@user_bp.route('', methods=['GET'])
def get_data():
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)
    return jsonify(data)

@user_bp.route('', methods=['POST'])
def add_user():
    new_entry = request.json
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    new_entry['user_id'] = len(data)
    new_entry['timestamp'] = datetime.now().isoformat()
    data.append(new_entry)

    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

    return jsonify({'message': 'Data added successfully'}), 201