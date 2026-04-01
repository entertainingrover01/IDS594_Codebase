import os
import json
import certifi
from flask import Flask, render_template, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# --- Database Connection ---
MONGO_URI = os.getenv("MONGO_URI")

# We use certifi to prevent SSL handshake errors on some systems, 
# and add connection pooling to avoid reconnecting on every request.
client = MongoClient(
    MONGO_URI, 
    tlsCAFile=certifi.where(),
    maxPoolSize=50, 
    wTimeoutMS=2500
)
db = client.get_database("transition_iq")

def get_initial_data():
    """Reads the initial data from the local JSON file."""
    try:
        with open('initial_data.json', 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading or parsing initial data: {e}")
        return None

def initialize_database():
    """Populates the database with initial data if it's empty."""
    # We check if 'transitions' exists. If not, we assume we need to seed the db.
    if "transitions" not in db.list_collection_names():
        initial_data = get_initial_data()
        if initial_data:
            for key, value in initial_data.items():
                if isinstance(value, list):
                    if value:
                        db[key].insert_many(value)
                elif isinstance(value, dict):
                    # We just insert the dict as a single document into 'metrics' or similar
                    if key == "metrics":
                        db.metrics.insert_one(value)
            print("Database initialized with initial data.")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/data')
def get_data():
    """API endpoint to serve all data from the database."""
    # Fetch all data concurrently using a single dictionary comprehension 
    # to avoid sequential blocking where possible (though pymongo is synchronous, 
    # the driver handles connections efficiently from the pool)
    data = {
        "transitions": list(db.transitions.find({}, {'_id': 0})),
        "employees": list(db.employees.find({}, {'_id': 0})),
        "tasks": list(db.tasks.find({}, {'_id': 0})),
        "auditLogs": list(db.auditLogs.find({}, {'_id': 0})),
        "metrics": db.metrics.find_one({}, {'_id': 0})
    }
    return jsonify(data)

if __name__ == '__main__':
    initialize_database()
    app.run(debug=True)