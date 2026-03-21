from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
# IMPORTANT: This allows your Vercel URL to talk to this Render API
CORS(app, origins=[
    "https://ges-mock.vercel.app",
    "http://localhost:5173"  # for local dev
], supports_credentials=True)

# Use absolute path for the database file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, 'database.db')

# Ensure the database is initialized when the module is imported (for Gunicorn)
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    print(f"Initializing database at {DATABASE}...")
    try:
        with get_db() as db:
            db.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    fullName TEXT,
                    email TEXT UNIQUE,
                    password TEXT,
                    role TEXT DEFAULT 'student'
                )
            ''')
            db.execute('''
                CREATE TABLE IF NOT EXISTS scores (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    userId INTEGER UNIQUE,
                    score INTEGER,
                    total INTEGER,
                    date TEXT,
                    FOREIGN KEY(userId) REFERENCES users(id)
                )
            ''')
            # Seed Admin
            admin = db.execute("SELECT id FROM users WHERE email = 'admin@dlcf.com'").fetchone()
            if not admin:
                db.execute("INSERT INTO users (fullName, email, password, role) VALUES (?, ?, ?, ?)",
                           ('Admin User', 'admin@dlcf.com', 'admin123', 'admin'))
            db.commit()
        print("Database initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")

# Call init_db immediately so it runs when Gunicorn starts the app
init_db()

# HOME ROUTE: Just a welcome message to prove the backend is alive
@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "message": "Johnfavour's GES Mock API is running!",
        "version": "1.0.0"
    })

@app.errorhandler(HTTPException)
def handle_http_exception(e):
    return jsonify({
        "error": e.name,
        "message": e.description,
        "path": request.path
    }), e.code

@app.errorhandler(Exception)
def handle_exception(e):
    # Detailed logging for debugging 500 errors on Render
    print(f"--- SERVER ERROR ---")
    print(f"Path: {request.path}")
    print(f"Exception: {str(e)}")
    return jsonify({
        "error": "Internal Server Error",
        "message": str(e),
        "path": request.path
    }), 500

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json(silent=True)
    print(f"--- Signup Request Received ---")
    print(f"Data: {data}")
    print(f"Headers: {dict(request.headers)}")
    
    if not data:
        return jsonify({
            "error": "No JSON data received",
            "details": "Make sure Content-Type is application/json and the body is valid JSON",
            "received_headers": dict(request.headers)
        }), 400
    
    required_fields = ['fullName', 'email', 'password']
    missing = [f for f in required_fields if f not in data or not data[f]]
    if missing:
        return jsonify({
            "error": "Missing required fields",
            "missing_fields": missing,
            "received_data": data
        }), 400
    
    try:
        with get_db() as db:
            # Case-insensitive email check
            existing = db.execute("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", (data['email'],)).fetchone()
            if existing:
                return jsonify({
                    "error": "Email already exists",
                    "email": data['email'],
                    "suggestion": "Try logging in or using a different email address"
                }), 400

            cursor = db.execute("INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)",
                               (data['fullName'], data['email'], data['password']))
            db.commit()
            return jsonify({
                "id": cursor.lastrowid,
                "fullName": data['fullName'],
                "email": data['email'],
                "role": 'student'
            })
    except Exception as e:
        print(f"Critical Signup Error: {e}")
        return jsonify({"error": "Internal Database Error", "details": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(silent=True)
    print(f"--- Login Request Received ---")
    print(f"Data: {data}")
    
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email and password are required"}), 400
        
    try:
        with get_db() as db:
            # Case-insensitive email lookup
            user = db.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", (data['email'],)).fetchone()
            
            if user:
                print(f"User found: {user['email']}, matching password...")
                if user['password'] == data['password']:
                    print(f"Login successful for {user['email']}")
                    return jsonify({
                        "id": user['id'],
                        "fullName": user['fullName'],
                        "email": user['email'],
                        "role": user['role']
                    })
                else:
                    print(f"Password mismatch for {user['email']}")
            else:
                print(f"No user found with email: {data['email']}")
                
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        print(f"Critical Login Error: {e}")
        return jsonify({"error": "Internal Database Error", "details": str(e)}), 500

@app.route('/api/scores', methods=['POST'])
def submit_score():
    data = request.json
    date = datetime.now().isoformat()
    try:
        with get_db() as db:
            # Check for existing score
            existing = db.execute("SELECT id FROM scores WHERE userId = ?", (data['userId'],)).fetchone()
            if existing:
                return jsonify({"error": "Score already recorded"}), 400
            
            db.execute("INSERT INTO scores (userId, score, total, date) VALUES (?, ?, ?, ?)",
                       (data['userId'], data['score'], data['total'], date))
            db.commit()
            return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/debug/users', methods=['GET'])
def debug_users():
    with get_db() as db:
        users = db.execute("SELECT id, fullName, email, role FROM users").fetchall()
        return jsonify([dict(row) for row in users])

@app.route('/api/scores/<int:user_id>', methods=['GET'])
def get_user_score(user_id):
    with get_db() as db:
        score = db.execute("SELECT score, total FROM scores WHERE userId = ?", (user_id,)).fetchone()
        if score:
            return jsonify({"score": score['score'], "total": score['total']})
        return jsonify(None)

@app.route('/api/admin/results', methods=['GET'])
def admin_results():
    with get_db() as db:
        results = db.execute('''
            SELECT u.fullName, u.email, s.score, s.total, s.date 
            FROM users u 
            LEFT JOIN scores s ON u.id = s.userId 
            WHERE u.role = 'student'
        ''').fetchall()
        return jsonify([dict(row) for row in results])

if __name__ == '__main__':
    app.run(port=5000, debug=True)
