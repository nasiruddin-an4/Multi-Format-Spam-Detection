import os
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from functools import wraps
import psycopg2
from psycopg2.extras import RealDictCursor
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import pandas as pd
import pickle
import json

app = Flask(__name__)
# Configure CORS to allow requests from the frontend with all necessary headers
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000", "http://localhost:5173/admin"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_key_please_change_in_production')
# app.config['DATABASE_URL'] = os.environ.get('DATABASE_URL', 'postgresql://postgres:Mango@292@localhost:5432/spam_detection')
app.config['DATABASE_URL'] = os.environ.get(
    'DATABASE_URL',
    'postgresql://postgres:Mango%40292@localhost:5432/spam_detection'
)

app.config['JWT_EXPIRATION'] = int(os.environ.get('JWT_EXPIRATION', 86400))  # 24 hours

# Database connection
def get_db_connection():
    conn = psycopg2.connect(app.config['DATABASE_URL'])
    conn.autocommit = True
    return conn

# Initialize database tables if they don't exist
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create messages table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        is_spam BOOLEAN NOT NULL,
        confidence FLOAT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Check if admin exists, if not create one
    cursor.execute("SELECT * FROM users WHERE email = 'admin@example.com'")
    admin = cursor.fetchone()
    
    if not admin:
        admin_password = generate_password_hash('admin123')
        cursor.execute(
            "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
            ('Admin User', 'admin@example.com', admin_password, 'admin')
        )
    
    conn.commit()
    cursor.close()
    conn.close()

# JWT Token Required Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header[7:]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            
            conn = get_db_connection()
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute("SELECT * FROM users WHERE id = %s", (data['user_id'],))
            current_user = cursor.fetchone()
            cursor.close()
            conn.close()
            
            if not current_user:
                return jsonify({'message': 'User no longer exists!'}), 401
            
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# Admin Required Decorator
def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user['role'] != 'admin':
            return jsonify({'message': 'Admin privileges required!'}), 403
        return f(current_user, *args, **kwargs)
    
    return decorated

# Load or train the ML model
def load_or_train_model():
    model_path = 'spam_model.pkl'
    
    # If model exists, load it
    if os.path.exists(model_path):
        with open(model_path, 'rb') as file:
            model = pickle.load(file)
        return model
    
    # Otherwise train a new model
    # Sample data for demonstration
    data = {
        'message': [
            'Free entry in 2 a weekly comp to win FA Cup final tkts',
            'URGENT! You have won a 1 week FREE membership in our £100,000 Prize Jackpot!',
            'Hello, how are you doing today?',
            'Meeting scheduled for tomorrow at 10am',
            'WINNER!! As a valued network customer you have been selected to receivea £900 prize reward!',
            'SIX chances to win CASH! From 100 to 20,000 pounds txt>'
        ],
        'label': [1, 1, 0, 0, 1, 1]  # 1 for spam, 0 for ham
    }
    
    df = pd.DataFrame(data)
    
    X_train, X_test, y_train, y_test = train_test_split(
        df['message'], df['label'], test_size=0.2, random_state=42
    )
    
    # Create and train the model
    model = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', max_features=5000)),
        ('classifier', MultinomialNB())
    ])
    
    model.fit(X_train, y_train)
    
    # Save the model
    with open(model_path, 'wb') as file:
        pickle.dump(model, file)
    
    return model

# Initialize the model
spam_model = load_or_train_model()

# Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not name or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400
    
    hashed_password = generate_password_hash(password)
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if email already exists
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'message': 'Email already registered'}), 409
        
        # Insert new user
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (%s, %s, %s) RETURNING id",
            (name, email, hashed_password)
        )
        
        user_id = cursor.fetchone()[0]
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'User registered successfully', 'user_id': user_id}), 201
    
    except Exception as e:
        return jsonify({'message': 'Registration failed', 'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        print(f"Login attempt failed: Missing email or password")
        return jsonify({'message': 'Missing email or password'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if not user:
            print(f"Login attempt failed: No user found with email {email}")
            return jsonify({'message': 'Invalid credentials'}), 401
            
        if not check_password_hash(user['password'], password):
            print(f"Login attempt failed: Invalid password for user {email}")
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Generate JWT token
        token_payload = {
            'user_id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.utcnow() + timedelta(seconds=app.config['JWT_EXPIRATION'])
        }
        
        token = jwt.encode(token_payload, app.config['SECRET_KEY'], algorithm="HS256")
        
        print(f"Successful login for user {email} with role {user['role']}")
        
        return jsonify({
            'token': token,
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        }), 200
    
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'message': 'Login failed', 'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
@token_required
def predict_spam(current_user):
    data = request.get_json()
    
    message = data.get('message')
    message_type = data.get('type', 'email')  # Default to email
    
    if not message:
        return jsonify({'message': 'No message provided'}), 400
    
    # Make prediction
    prediction = spam_model.predict([message])[0]
    confidence = float(spam_model.predict_proba([message])[0][prediction])
    
    is_spam = bool(prediction)
    
    # Save message to database
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "INSERT INTO messages (user_id, content, type, is_spam, confidence) VALUES (%s, %s, %s, %s, %s)",
            (current_user['id'], message, message_type, is_spam, confidence)
        )
        
        conn.commit()
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error saving message: {e}")
    
    return jsonify({
        'isSpam': is_spam,
        'confidence': confidence,
        'message': 'Spam detected' if is_spam else 'Not spam'
    }), 200

# Admin routes
@app.route('/api/admin/stats', methods=['GET'])
@token_required
@admin_required
def admin_stats(current_user):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get total users
        cursor.execute("SELECT COUNT(*) as count FROM users")
        total_users = cursor.fetchone()['count']
        
        # Get total messages
        cursor.execute("SELECT COUNT(*) as count FROM messages")
        total_messages = cursor.fetchone()['count']
        
        # Get spam count
        cursor.execute("SELECT COUNT(*) as count FROM messages WHERE is_spam = true")
        spam_count = cursor.fetchone()['count']
        
        # Get ham count
        cursor.execute("SELECT COUNT(*) as count FROM messages WHERE is_spam = false")
        ham_count = cursor.fetchone()['count']
        
        # Get messages by type
        cursor.execute("""
            SELECT 
                COUNT(CASE WHEN type = 'email' THEN 1 END) as email,
                COUNT(CASE WHEN type = 'sms' THEN 1 END) as sms,
                COUNT(CASE WHEN type = 'social' THEN 1 END) as social
            FROM messages
        """)
        messages_by_type = cursor.fetchone()
        
        # Get recent activity
        cursor.execute("""
            SELECT m.id, m.content, m.type, m.is_spam, m.confidence, m.created_at,
                   json_build_object('id', u.id, 'name', u.name, 'email', u.email) as user
            FROM messages m
            JOIN users u ON m.user_id = u.id
            ORDER BY m.created_at DESC
            LIMIT 5
        """)
        recent_activity = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'totalUsers': total_users,
            'totalMessages': total_messages,
            'spamCount': spam_count,
            'hamCount': ham_count,
            'messagesByType': messages_by_type,
            'recentActivity': recent_activity
        }), 200
    
    except Exception as e:
        return jsonify({'message': 'Error fetching admin stats', 'error': str(e)}), 500

@app.route('/api/admin/users', methods=['GET'])
@token_required
@admin_required
def get_users(current_user):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC")
        users = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(users), 200
    
    except Exception as e:
        return jsonify({'message': 'Error fetching users', 'error': str(e)}), 500

@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_user(current_user, user_id):
    # Prevent deleting your own account
    if current_user['id'] == user_id:
        return jsonify({'message': 'Cannot delete your own account'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Check if user exists and is not an admin
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        if user['role'] == 'admin':
            return jsonify({'message': 'Cannot delete admin users'}), 403
        
        # Delete user's messages first (due to foreign key constraint)
        cursor.execute("DELETE FROM messages WHERE user_id = %s", (user_id,))
        
        # Delete user
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'User deleted successfully'}), 200
    
    except Exception as e:
        return jsonify({'message': 'Error deleting user', 'error': str(e)}), 500

@app.route('/api/admin/messages', methods=['GET'])
@token_required
@admin_required
def get_messages(current_user):
    is_spam = request.args.get('isSpam')
    message_type = request.args.get('type')
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT m.id, m.content, m.type, m.is_spam, m.confidence, m.created_at,
                   json_build_object('id', u.id, 'name', u.name, 'email', u.email) as user
            FROM messages m
            JOIN users u ON m.user_id = u.id
            WHERE 1=1
        """
        params = []
        
        if is_spam is not None:
            is_spam_bool = is_spam.lower() == 'true'
            query += " AND m.is_spam = %s"
            params.append(is_spam_bool)
        
        if message_type:
            query += " AND m.type = %s"
            params.append(message_type)
        
        query += " ORDER BY m.created_at DESC"
        
        cursor.execute(query, params)
        messages = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify(messages), 200
    
    except Exception as e:
        return jsonify({'message': 'Error fetching messages', 'error': str(e)}), 500

# Initialize the database
init_db()

# Run the app
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)