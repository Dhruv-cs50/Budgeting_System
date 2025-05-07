"""
Transactions Module

This module defines routes for managing transaction records in the budgeting application.
It provides endpoints to add new transactions and retrieve transaction history.
"""

from flask import Blueprint, request, jsonify
import json
import os
from datetime import datetime

transactions_bp = Blueprint('transactions', __name__, url_prefix='/api/transactions/')

DATA_FILE = 'data.json'

@transactions_bp.route('/', methods=['POST'])
def add_transaction():
    """
    Add a new transaction to the system.
    
    Expected JSON in request body:
    {
        "userId": int,
        "amount": float,
        "type": str,  # "deposit" or "purchase"
        "description": str,
        "category": str
    }
    
    Returns:
        JSON: Success message and 201 status code if successful
    """
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
    """
    Retrieve all transactions from the system.
    
    Returns:
        JSON: List of all transactions, or empty list if no transactions exist
    """
    if not os.path.exists(DATA_FILE):
        return jsonify([]), 200
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)
    return jsonify(data), 200
    
    