from flask import Flask
from flask_cors import CORS
from routes import users, purchase, deposit

app = Flask(__name__)
CORS(app)

# Register blueprints from the routes folder
app.register_blueprint(users.user_bp)
app.register_blueprint(purchase.purchase_bp)
app.register_blueprint(deposit.deposit_bp)

@app.route('/')
def home():
    return "Server is running!!"

if __name__ == '__main__':
    app.run(debug=True, port=5000)