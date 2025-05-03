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

@purchase_bp.route('/<int:user_id>', methods=['PATCH'])
def record_purchase(user_id):
    """
    PATCH /api/data/purchase/<user_id>
    Records a new purchase for a specific user. Deducts the cost of the purchase
    from the user's current balance, timestamps the transaction, and appends it
    to the user's purchases list.

    Expected JSON in request body:
    {
        "name": String,
        "purchaseCategory": String,
        "purchaseCost": Float
    }

    Response: Confirmation message or appropriate error if user not found or data is invalid.
    """
    new_entry = request.json

    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    for user in data:
        if user['user_id'] == user_id:
            try:
                if user['currentBalance'] - float(new_entry['purchaseCost']) < 0:
                    return jsonify({'error': 'Insufficient funds.'}), 400

                user['currentBalance'] = round(user['currentBalance'] - float(new_entry['purchaseCost']), 2)
                purchases = user.get('purchases', [])
                new_entry['purchaseId'] = len(purchases)
                new_entry['purchaseDate'] = datetime.now().isoformat()
                purchases.append(new_entry)
                user['purchases'] = purchases
                break
            except (KeyError, TypeError, ValueError):
                return jsonify({'error': 'Invalid or missing purchaseCost value.'}), 400
    else:
        return jsonify({'error': 'User not found.'}), 404

    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

    return jsonify({'message': 'Purchase recorded successfully'}), 201



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
        if user['user_id'] == user_id:
            purchases = user.get('purchases', [])
            break
    else:
        return jsonify({'error': 'User not found.'}), 404

    for i, p in enumerate(purchases):
        if p['purchaseId'] == purchase_id:
            try:
                user['currentBalance'] = round(float(user['currentBalance']) + float(p['purchaseCost']), 2)
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