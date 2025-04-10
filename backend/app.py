from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Define the JSON file acting as our "database"
DATA_FILE = 'data.json'

# If the file doesn't exist yet, create it with an empty list
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)


@app.route('/api/data', methods=['GET'])
def get_data():
    """
    Reads the data from the JSON file and returns it as a JSON list.
    """
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)
    return jsonify(data)


@app.route('/api/data', methods=['POST'])
def add_user():
    """
    Accepts a JSON object and appends it to the JSON file.
    """
    new_entry = request.json  # Incoming data

    # Read existing data
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    new_entry['user_id'] = len(data)
    new_entry['timestamp'] = datetime.now().isoformat()
    #Need to think about handling money and name... Should be sent by the front end.

    # Append the new entry
    data.append(new_entry)

    # Write updated data back to the file
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

    return jsonify({'message': 'Data added successfully'}), 201


@app.route('/api/data/purchase/<int:user_id>', methods=['PATCH'])
def record_purchase(user_id):
    """
    Accepts a JSON object and appends it to the JSON file.
    """
    new_entry = request.json  # Incoming data

    # Pull existing data
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    # Append the new entry to the existing user's data
    for user in data:
        print(user)
        if user['user_id'] == user_id:
            
            try:
                if user['money'] - float(new_entry['moneySpent']) < 0:
                    return jsonify({'error': 'Insufficient funds.'}), 400

                user['money'] -= float(new_entry['moneySpent'])
            
                recent_purchases = user.get('recentPurchases', [])
                new_entry['purchaseId'] = len(recent_purchases) 
                new_entry['timestamp'] = datetime.now().isoformat()

                recent_purchases.append(new_entry)

                user['recentPurchases'] = (recent_purchases)
                break
            except (KeyError, TypeError, ValueError):
                return jsonify({'error': 'Invalid or missing moneySpent value.'}), 400            

    else:
        #TODO: Insert logic to automatically create a user. Trouble is, a name has to be provided to make a new user...
        return jsonify({'error': 'User not found.'}), 404
        pass

    # Write updated data back to the file (replaces everything)
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

    return jsonify({'message': 'Purchase recorded successfully'}), 201

@app.route('/api/data/deposit/<int:user_id>', methods=['PATCH'])
def record_deposit(user_id):
    """
    Accepts a JSON object and appends it to the JSON file.
    """
    new_entry = request.json # Incoming data

    # Pull existing data
    with open(DATA_FILE, 'r') as f:
        data = json.load(f)

    # Append the new entry to the existing user's data and adjust their funds accordingly
    for user in data:
        if user['user_id'] == user_id:
            
            try:
                # Add deposit to the user's funds
                if user['money'] < 0:
                    return jsonify({'error': 'You cannot desposit a negative amount.'}), 400
                user['money'] += float(new_entry['moneyDeposited'])
            
                # Record deposit
                recent_deposit = user.get('recentDeposit', [])
                new_entry['depositId'] = len(recent_deposit) 
                new_entry['timestamp'] = datetime.now().isoformat()

                recent_deposit.append(new_entry)

                user['recentDeposit'] = (recent_deposit)
                break
            except (KeyError, TypeError, ValueError):
                return jsonify({'error': 'Invalid or missing moneySpent value.'}), 400            

    else:
        #TODO: Insert logic to automatically create a user. Trouble is, a name has to be provided to make a new user...
        return jsonify({'error': 'User not found.'}), 404

    # Write updated data back to the file (replaces everything)
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

    return jsonify({'message': 'Purchase recorded successfully'}), 201


@app.route('/')
def home():
    return "Server is running!!"


if __name__ == '__main__':
    app.run(debug=True, port=5000)