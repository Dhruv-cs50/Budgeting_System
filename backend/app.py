from routes import all_users
from flask import Flask, jsonify
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

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, port=5001)