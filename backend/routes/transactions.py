from flask import Blueprint, request, jsonify
import json
import os
from datetime import datetime

transactions_bp = Blueprint('transactions', __name__, url_prefix='/api/transactions/')

DATA_FILE = 'data.json'

@transactions_bp.route('/', methods=['POST'])
def add_transaction():
    transaction = request.json

    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump([], f)
    
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)
    
    transaction['timestamp'] = datetime.now().isoformat()
    data.append(transaction)

    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

    return jsonify({'message': 'Transaction added successfully'}), 201   

@transactions_bp.route('/', methods=['GET'])
def get_transactions():
    if not os.path.exists(DATA_FILE):
        return jsonify([]), 200
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)
    return jsonify(data), 200
    
    