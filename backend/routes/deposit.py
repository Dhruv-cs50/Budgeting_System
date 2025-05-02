from flask import Blueprint, jsonify, request
import json
from datetime import datetime

"""
This module defines routes for managing deposit records in the budgeting application.
It provides endpoints to retrieve, record, and delete deposit entries for users.
"""

deposit_bp = Blueprint('deposits', __name__, url_prefix='/api/data/deposit')
DATA_FILE = 'data.json' # WARNING: THIS IS DANGEROUS. MUST STORE AS AN ENVIRONMENT VARIABLE IF THIS GETS PUBLICLY DEPLOYED

@deposit_bp.route('/<int:user_id>', methods=['GET'])
def get_deposits(user_id):
    """
    GET /api/data/deposit/<user_id>
    Retrieves the recent deposits record for a given user.

    @param user_id - The id of the user. Provided by the URL variable, <int:user_id>
    @return A JSON representation of all recent deposits made by the user.
    """
    new_entry = request.json

    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    for user in data:
        if user['user_id'] == user_id:
            return jsonify(user.get('deposits', []))
        

@deposit_bp.route('/<int:user_id>', methods=['PATCH'])
def record_deposit(user_id):
    """
    PATCH /api/data/deposit/<user_id>
    Records a new deposit for the specified user and updates their balance.

    Expected JSON in request body:
    {
        "depositAmount": float (amount to deposit)
    }

    @param user_id - The id of the user. Provided by the URL variable, <int:user_id>
    @return Confirmation message or error if input is invalid or user not found.
    """
    new_entry = request.json

    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    for user in data:
        if user['user_id'] == user_id:
            try:
                if float(new_entry.get('depositAmount', 0)) < 0:
                    return jsonify({'error': 'Cannot deposit a negative amount.'}), 400
                user['currentBalance'] = round(user['currentBalance'] + float(new_entry['depositAmount']), 2)
                recent_deposit = user.get('deposits', [])
                new_entry['depositId'] = len(recent_deposit)
                new_entry['timestamp'] = datetime.now().isoformat()
                recent_deposit.append(new_entry)
                user['deposits'] = recent_deposit
                break
            except (KeyError, TypeError, ValueError):
                return jsonify({'error': 'Invalid or missing depositAmount value.'}), 400
    else:
        return jsonify({'error': 'User not found.'}), 404

    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

    return jsonify({'message': 'Deposit recorded successfully'}), 201



@deposit_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_deposit(user_id):
    """
    DELETE /api/data/deposit/<user_id>
    Deletes a deposit from a specific user's deposits list by matching the depositId.
    Also removes the deposit amount from the user's current balance.

    Expected JSON in request body:
    {
        "depositId": int
    }

    @param user_id - The id of the user. Provided by the URL variable, <int:user_id>
    @return Confirmation message or appropriate error if deposit/user not found or if input is invalid.
    """
    deposit_json = request.json
    deposit_id = deposit_json.get('depositId')

    if deposit_id is None:
        return jsonify({'error': 'Missing depositId in request.'}), 400

    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    for user in data:
        if user['user_id'] == user_id:
            deposits = user.get('deposits', [])
            break
    else:
        return jsonify({'error': 'User not found.'}), 404

    for i, d in enumerate(deposits):
        if d['depositId'] == deposit_id:
            try:
                user['currentBalance'] = round(user['currentBalance'] - float(d['depositAmount']), 2)
            except (KeyError, TypeError, ValueError):
                return jsonify({'error': 'Invalid or missing depositAmount value.'}), 400

            deposits.pop(i)  # Remove the deposit from the JSON
            # Reindex remaining deposits to ensure continuity
            for idx, deposit in enumerate(deposits):
                deposit['depositId'] = idx

            user['deposits'] = deposits

            with open(DATA_FILE, 'w') as f:
                json.dump(data, f, indent=4)

            return jsonify({'message': 'Deposit deleted successfully'}), 200

    return jsonify({'error': 'Deposit not found.'}), 404