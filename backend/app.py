from backend.routes import all_users
from flask import Flask
from flask_cors import CORS
from routes import purchase, deposit

app = Flask(__name__)
CORS(app)

# Register blueprints from the routes folder
app.register_blueprint(all_users.user_bp)
print("Users_bp works")
app.register_blueprint(purchase.purchase_bp)
print("Purchase_bp works")
app.register_blueprint(deposit.deposit_bp)
print("Deposit_bp works")

@app.route('/')
def home():
    return "Server is running!!"

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, port=5001)