from flask import Blueprint, jsonify, request
import json
from datetime import datetime

purchase_bp = Blueprint('purchases', __name__, url_prefix='/api/data/purchase')
DATA_FILE = 'data.json'


@purchase_bp.route('/<int:user_id>', methods=['GET'])
def get_purchase(user_id):
    """
    GET /api/data/purchase/<user_id>
    Fetches all purchase records for a specific user by their user_id.
    Returns a list of purchases associated with the user.

    Response: JSON array of purchase objects.
    """
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    for user in data:
        if user['user_id'] == user_id:
            return jsonify(user.get('purchases', []))

@purchase_bp.route('/users/<int:user_id>/transactions', methods=['POST'])
def add_transaction(user_id):
    new_transaction = request.json
    with open(DATA_FILE, 'r') as f:
        users = json.load(f)
    # Find the user
    for user in users:
        if user.get('user_id') == user_id or user.get('userId') == user_id:
            if 'purchases' not in user:
                user['purchases'] = []
            new_transaction['purchaseId'] = len(user['purchases'])
            user['purchases'].append(new_transaction)
            # Update currentBalance
            try:
                cost = float(new_transaction.get('purchaseCost', 0))
                if cost < 0:
                    user['currentBalance'] = round(float(user['currentBalance']) + cost, 2)
                else:
                    user['currentBalance'] = round(float(user['currentBalance']) + cost, 2)
            except (KeyError, TypeError, ValueError):
                pass
            break
    else:
        return jsonify({'error': 'User not found'}), 404
    with open(DATA_FILE, 'w') as f:
        json.dump(users, f, indent=4)
    return jsonify({'success': True, 'user': user})

@purchase_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_purchase(user_id):
    """
    DELETE /api/data/purchase/<user_id>
    Deletes a purchase from a specific user's purchase list by matching the purchaseId.
    Also refunds the cost of the deleted purchase back to the user's current balance.

    Expected JSON in request body:
    {
        "purchaseId": int
    }
    Could also just be all of the purchase info, but its better if the front-end just send the purchaseId

    Response: Confirmation message or appropriate error if purchase/user not found or if input is invalid.
    """
    purchase_json = request.json
    purchase_id = purchase_json.get('purchaseId')

    if purchase_id is None:
        return jsonify({'error': 'Missing purchaseId in request.'}), 400

    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    for user in data:
        if user.get('user_id') == user_id or user.get('userId') == user_id or user.get('id') == user_id:
            purchases = user.get('purchases', [])
            break
    else:
        return jsonify({'error': 'User not found.'}), 404

    for i, p in enumerate(purchases):
        if p['purchaseId'] == purchase_id:
            try:
                cost = float(p['purchaseCost'])
                user['currentBalance'] = round(float(user['currentBalance']) - cost, 2)
            except (KeyError, TypeError, ValueError):
                return jsonify({'error': 'Invalid or missing purchaseCost value.'}), 400

            purchases.pop(i)  # Remove the purchase from the JSON
            # Reindex remaining purchases to ensure continuity
            for idx, purchase in enumerate(purchases):
                purchase['purchaseId'] = idx

            user['purchases'] = purchases

            with open(DATA_FILE, 'w') as f:
                json.dump(data, f, indent=4)

            return jsonify({'message': 'Purchase deleted successfully'}), 200

    return jsonify({'error': 'Purchase not found.'}), 404