from flask import Blueprint, jsonify, request
import json
from datetime import datetime

deposit_bp = Blueprint('deposits', __name__, url_prefix='/api/data/deposit')
DATA_FILE = 'data.json'

@deposit_bp.route('/<int:user_id>', methods=['GET'])
def get_purcahses(user_id):
    """
    Retrieves the recent purchases record for a given user
    @param user_id - The id of the user. Provided by the URL variable, <int:user_id>
    @return A json representation of all recent purchases made by a user
    
    """
    new_entry = request.json

    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    for user in data:
        if user['user_id'] == user_id:
            return jsonify(user['recentDeposit'])
        


@deposit_bp.route('/<int:user_id>', methods=['PATCH'])
def record_deposit(user_id):
    new_entry = request.json

    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    for user in data:
        if user['user_id'] == user_id:
            try:
                if float(new_entry.get('moneyDeposited', 0)) < 0:
                    return jsonify({'error': 'Cannot deposit a negative amount.'}), 400
                user['money'] += float(new_entry['moneyDeposited'])
                recent_deposit = user.get('recentDeposit', [])
                new_entry['depositId'] = len(recent_deposit)
                new_entry['timestamp'] = datetime.now().isoformat()
                recent_deposit.append(new_entry)
                user['recentDeposit'] = recent_deposit
                break
            except (KeyError, TypeError, ValueError):
                return jsonify({'error': 'Invalid or missing moneyDeposited value.'}), 400
    else:
        return jsonify({'error': 'User not found.'}), 404

    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

    return jsonify({'message': 'Deposit recorded successfully'}), 201



@deposit_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_deposit(user_id):
    deposit_info = request.json
    #JSON sent by the front-end should provide the purhcase ID of the purchase to be deleted

    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    for user in data:
        if user['user_id'] == user_id:
            try:
                if float(new_entry.get('moneyDeposited', 0)) < 0:
                    return jsonify({'error': 'Cannot deposit a negative amount.'}), 400
                user['money'] += float(new_entry['moneyDeposited'])
                recent_deposit = user.get('recentDeposit', [])
                new_entry['depositId'] = len(recent_deposit)
                new_entry['timestamp'] = datetime.now().isoformat()
                recent_deposit.append(new_entry)
                user['recentDeposit'] = recent_deposit
                break
            except (KeyError, TypeError, ValueError):
                return jsonify({'error': 'Invalid or missing moneyDeposited value.'}), 400
    else:
        return jsonify({'error': 'User not found.'}), 404

    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

    return jsonify({'message': 'Deposit recorded successfully'}), 201