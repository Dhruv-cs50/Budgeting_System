import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import csv

load_dotenv()  # Load environment variables from .env

app = Flask(__name__)
CORS(app)

DATA_FILE = os.getenv("CSV_FILE", "data.csv")

app = Flask(__name__)

# Enable CORS so frontend apps (like React on another port) can make requests to this backend
CORS(app)

# Define the name of the CSV file that serves as our lightweight "database"
DATA_FILE = 'data.csv'


@app.route('/api/data', methods=['GET'])
def get_data():
    """
    Handle GET requests to /api/data.
    Reads the data from the CSV file and returns it as a JSON list.
    This allows the frontend to fetch all existing entries.
    """
    df = pd.read_csv(DATA_FILE)
    return df.to_json(orient='records')


@app.route('/api/data', methods=['POST'])
def add_data():
    """
    Handle POST requests to /api/data.
    Accepts a JSON object from the client (via request body),
    converts it into a one-row DataFrame, and appends it to the CSV.
    This allows the frontend to add new entries to the dataset.
    """
    new_entry = request.json  # Extract the incoming data from the POST request
    df = pd.read_csv(DATA_FILE)  # Load the existing CSV data

    # Convert the incoming JSON (dict) to a one-row DataFrame
    new_row_df = pd.DataFrame([new_entry])

    # Concatenate the new row to the existing DataFrame
    df = pd.concat([df, new_row_df], ignore_index=True)

    # Save the updated DataFrame back to the CSV file
    df.to_csv(DATA_FILE, index=False)

    return jsonify({'message': 'Data added successfully'}), 201  # Return a success message with status code 201


@app.route('/')
def home():
    """
    A simple home route for testing server status.
    Returns a basic string message when visiting the root URL.
    """
    return "Server is running!!"


# If this script is run directly, start the Flask development server
if __name__ == '__main__':
    app.run(debug=True, port=5000)