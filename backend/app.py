from routes import all_users
from flask import Flask, jsonify, request
from flask_cors import CORS
from routes import purchase, deposit, user, transactions
import json
import urllib.parse

app = Flask(__name__)
CORS(app)

app.register_blueprint(all_users.all_users_bp)
print("Users_bp works")
app.register_blueprint(user.user_bp)
print("User_bp works")
app.register_blueprint(purchase.purchase_bp)
print("Purchase_bp works")
app.register_blueprint(deposit.deposit_bp)
print("Deposit_bp works")
app.register_blueprint(transactions.transactions_bp)
print("Transactions_bp works")

@app.route('/')
def home():
    return "Server is running!!"

@app.route('/users', methods=['GET'])
def get_all_users():
    with open('data.json') as f:
        users = json.load(f)
    return jsonify(users)

@app.route('/users/email/<email>', methods=['GET'])
def get_user_by_email(email):
    decoded_email = urllib.parse.unquote(email)
    with open('data.json') as f:
        users = json.load(f)
    for user in users:
        if user.get('email') == decoded_email:
            return jsonify(user)
    return jsonify({'error': 'User not found'}), 404

@app.route('/users/email/<email>', methods=['PATCH'])
def update_user_by_email(email):
    decoded_email = urllib.parse.unquote(email)
    update_data = request.json
    print("PATCH update for:", decoded_email, update_data) 
    with open('data.json', 'r') as f:
        users = json.load(f)
    updated = False
    for user in users:
        if user.get('email') == decoded_email:
            print("Found user:", user) 
            user.update(update_data)
            updated = True
            break
    if updated:
        with open('data.json', 'w') as f:
            json.dump(users, f, indent=4)
        print("User updated successfully.")
        return jsonify({'message': 'User updated successfully'})
    else:
        print("User not found for PATCH.") 
        return jsonify({'error': 'User not found'}), 404

@app.route('/users/<int:user_id>/goals/<int:goal_id>', methods=['PATCH'])
def update_goal_amount(user_id, goal_id):
    update_data = request.json
    amount_to_add = update_data.get('amountToAdd')
    print(f"PATCH /users/{user_id}/goals/{goal_id} with amountToAdd={amount_to_add}")
    if amount_to_add is None:
        return jsonify({'error': 'Missing amountToAdd in request.'}), 400
    with open('data.json', 'r') as f:
        users = json.load(f)
    for user in users:
        if user.get('user_id') == user_id or user.get('userId') == user_id:
            goals = user.get('financialGoals', [])
            for goal in goals:
                if goal.get('goalId') == goal_id:
                    goal['currentAmount'] = float(goal.get('currentAmount', 0)) + float(amount_to_add)
                    if goal.get('targetAmount'):
                        goal['percentageCompleted'] = int((goal['currentAmount'] / goal['targetAmount']) * 100)
                    print(f"Updated goal: {goal}")
                    with open('data.json', 'w') as f:
                        json.dump(users, f, indent=4)
                    return jsonify({'message': 'Goal updated successfully', 'goal': goal})
            print('Goal not found for PATCH')
            return jsonify({'error': 'Goal not found'}), 404
    print('User not found for PATCH')
    return jsonify({'error': 'User not found'}), 404

@app.route('/users/<int:user_id>/goals', methods=['POST'])
def add_goal(user_id):
    new_goal = request.json
    with open('data.json', 'r') as f:
        users = json.load(f)
    for user in users:
        if user.get('user_id') == user_id or user.get('userId') == user_id:
            if 'financialGoals' not in user:
                user['financialGoals'] = []
            new_goal['goalId'] = len(user['financialGoals'])
            new_goal['percentageCompleted'] = int((float(new_goal.get('currentAmount', 0)) / float(new_goal.get('targetAmount', 1))) * 100)
            user['financialGoals'].append(new_goal)
            break
    else:
        return jsonify({'error': 'User not found'}), 404
    with open('data.json', 'w') as f:
        json.dump(users, f, indent=4)
    return jsonify({'message': 'Goal added successfully', 'goal': new_goal}), 201

@app.route('/users/<int:user_id>/goals', methods=['GET'])
def get_goals(user_id):
    with open('data.json', 'r') as f:
        users = json.load(f)
    for user in users:
        if user.get('user_id') == user_id or user.get('userId') == user_id:
            return jsonify({'goals': user.get('financialGoals', [])}), 200
    return jsonify({'error': 'User not found'}), 404

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, port=5001)