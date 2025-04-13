from flask import Blueprint, jsonify, request
import json
from datetime import datetime

purchase_bp = Blueprint('purchases', __name__, url_prefix='/api/data/purchase')
DATA_FILE = 'data.json'


@purchase_bp.route('/<int:user_id>', methods=['GET'])
def record_purchase(user_id):
    new_entry = request.json

    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    for user in data:
        if user['user_id'] == user_id:
            return jsonify(user['recentPurchases'])

@purchase_bp.route('/<int:user_id>', methods=['PATCH'])
def record_purchase(user_id):
    new_entry = request.json

    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    for user in data:
        if user['user_id'] == user_id:
            try:
                if user['money'] - float(new_entry['moneySpent']) < 0:
                    return jsonify({'error': 'Insufficient funds.'}), 400

                user['money'] -= float(new_entry['moneySpent'])
                recent_purchases = user.get('recentPurchases', [])
                new_entry['purchaseId'] = len(recent_purchases)
                new_entry['timestamp'] = datetime.now().isoformat()
                recent_purchases.append(new_entry)
                user['recentPurchases'] = recent_purchases
                break
            except (KeyError, TypeError, ValueError):
                return jsonify({'error': 'Invalid or missing moneySpent value.'}), 400
    else:
        return jsonify({'error': 'User not found.'}), 404

    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

    return jsonify({'message': 'Purchase recorded successfully'}), 201