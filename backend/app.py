import os
from datetime import datetime, timezone, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt.api_jwt as jwt
from functools import wraps
import psycopg2
from psycopg2.extras import RealDictCursor
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import pandas as pd
import json
import re
import unicodedata
from collections import defaultdict

app = Flask(__name__)
# Configure CORS to allow requests from the frontend with all necessary headers
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_key_please_change_in_production')
app.config['DATABASE_URL'] = os.environ.get(
    'DATABASE_URL',
    'postgresql://postgres:Mango%40292@localhost:5432/spam_detection'
)
app.config['JWT_EXPIRATION'] = int(os.environ.get('JWT_EXPIRATION', 86400))  # 24 hours

# Global model variables
spam_model = None
text_preprocessor = None
tfidf_vectorizer = None

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
    
    # Create messages table with enhanced fields
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        language VARCHAR(10) DEFAULT 'unknown',
        is_spam BOOLEAN NOT NULL,
        confidence FLOAT NOT NULL,
        spam_indicators JSONB DEFAULT '{}',
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

# Enhanced text preprocessing for multi-language support
class MultiLanguagePreprocessor:
    def __init__(self):
        # Common spam keywords in different languages
        self.spam_keywords = {
            'bangla': [
                # Existing ones
                'বিনামূল্যে', 'ফ্রি', 'জিতুন', 'পুরস্কার', 'লটারি', 'টাকা', 'অফার',
                'ছাড়', 'জরুরি', 'এখনই', 'ক্লিক', 'কল করুন', 'গ্যারান্টি', 'বিজয়ী',
                'লাভজনক', 'সুযোগ', 'সীমিত', 'দ্রুত', 'নিশ্চিত', 'জিতেছেন', 'পেতে',
                'রিচার্জ', 'লক্ষ', 'হাজার', 'কোটি', 'একাউন্ট', 'বন্ধ', 'সমস্যা',
                'বিশেষ', 'ডিসকাউন্ট', 'মোবাইল', 'ফোন', 'নম্বর', 'এসএমএস',

                # New additions (more realistic spam triggers)
                'কিস্তি', 'ঋণ', 'ইএমআই', 'ধার', 'ফান্ড', 'প্রফিট',
                'ডিপোজিট', 'সঞ্চয়', 'ইনকাম', 'আয়', 'অর্থ',
                'পেমেন্ট', 'লেনদেন', 'ক্যাশ', 'ডলার', 'রেমিটেন্স',
                'টাকা পাঠান', 'অ্যাকাউন্ট নম্বর', 'ভেরিফাই', 'পাসওয়ার্ড', 'ওটিপি',
                'সীমিত সময়', 'এক্সক্লুসিভ', 'বোনাস', 'প্রাইজ',
                'লাভ', 'ব্যবসা', 'চাকরি', 'পার্ট টাইম', 'আয় করুন',
                'সোনা', 'হীরার', 'প্রপার্টি', 'প্লট', 'ফ্ল্যাট',
                'শেয়ার বাজার', 'স্টক', 'বিনিয়োগ',
                'ভিডিও দেখুন', 'লাইক করুন', 'শেয়ার করুন', 'সাবস্ক্রাইব',
                'ভিসা', 'মাস্টারকার্ড', 'ক্রেডিট কার্ড', 'ডেবিট কার্ড',
                'লিমিটেড অফার', 'ফেক', 'অবিলম্বে', 'অ্যাপ ডাউনলোড',
                'অরিজিনাল প্রোডাক্ট', 'সস্তা দামে', 'নতুন কালেকশন', 'অর্ডার করুন',
                '১০০% গ্যারান্টি', 'নিশ্চিত আয়', 'আজকেই', 'হাজার হাজার',
                'বিদেশে চাকরি', 'ভিসা প্রসেসিং', 'ফ্রি ভিসা', 'ওয়ার্ক পারমিট',
                'ট্রেনিং ফ্রি', 'সার্টিফিকেট', 'ডিগ্রি', 'অ্যাডমিশন', 'ফ্রি রেজিস্ট্রেশন',
                'ইন্টারনেট প্যাক', 'ফ্রি মিনিট', 'ফ্রি এসএমএস', 'ফ্রি এমবি',
                'জয়েন করুন', 'সদস্য হোন', 'ভিআইপি অফার'
            ],
            'english': [
                'free', 'win', 'winner', 'cash', 'prize', 'urgent', 'offer',
                'limited', 'click', 'call now', 'guarantee', 'discount',
                'congratulation', 'lucky', 'selected', 'money', 'loan',
                'credit', 'debt', 'income', 'profit', 'bonus', 'reward',
                'exclusive', 'limited time', 'act now', 'hurry', 'today only',
                'investment', 'business opportunity', 'work from home'
            ],
            'spanish': [
                'gratis', 'ganar', 'ganador', 'dinero', 'premio', 'urgente', 'oferta',
                'limitado', 'clic', 'llame ahora', 'garantía', 'descuento',
                'felicitaciones', 'suerte', 'seleccionado', 'préstamo', 'crédito',
                'efectivo', 'bono', 'exclusivo', 'tiempo limitado', 'oportunidad',
                'trabaja desde casa', 'inversión', 'ganancias', 'promoción'
            ]
        }

        # Enhanced patterns for Bengali text
        self.patterns = {
            'phone': re.compile(r'(\+?88)?[-\s]?01[3-9]\d{8}|(\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,6}'),
            'bangla_numbers': re.compile(r'[০-৯]+'),
            'money_bangla': re.compile(r'৳\s*[\d০-৯]+|[\d০-৯]+\s*(টাকা|হাজার|লক্ষ|লাখ|কোটি)'),
            'money_english': re.compile(r'[$€£]\s*\d+|\d+\s*(?:dollars|euro|pound|USD|EUR|GBP)', re.IGNORECASE),
            'urgent_bangla': re.compile(r'(জরুরি|এখনই|তাড়াতাড়ি|দ্রুত|অবিলম্বে)', re.IGNORECASE),
            'urgent_english': re.compile(r'(urgent|now|hurry|limited time|act now|today only)', re.IGNORECASE),
            'urls': re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
        }

    def detect_language(self, text):
        """Enhanced language detection for Bengali text"""
        # Count Bengali characters
        bengali_chars = len(re.findall(r'[\u0980-\u09FF]', text))
        # Count Spanish characters
        spanish_chars = len(re.findall(r'[áéíóúñ¿¡]', text.lower()))
        # Count English letters
        english_chars = len(re.findall(r'[a-zA-Z]', text))
        # Count total meaningful characters
        total_chars = len(re.sub(r'[\s\d\W]', '', text))
        
        if total_chars == 0:
            return 'unknown'
        
        # Calculate ratios
        bengali_ratio = bengali_chars / max(total_chars, 1)
        spanish_ratio = spanish_chars / max(total_chars, 1)
        english_ratio = english_chars / max(total_chars, 1)
        
        # Determine language based on character ratios
        if bengali_ratio > 0.3:  # Lowered threshold for Bengali
            return 'bangla'
        elif spanish_ratio > 0.1:
            return 'spanish'
        elif english_ratio > 0.6:
            return 'english'
        elif bengali_ratio > 0.1 and english_ratio > 0.1:
            return 'mixed'
        else:
            return 'unknown'

    def extract_features(self, text):
        """Extract spam indicators from text"""
        features = defaultdict(int)
        text_lower = text.lower()
        
        # Language detection
        language = self.detect_language(text)
        features['language'] = language
        
        # Keyword matching
        for lang, keywords in self.spam_keywords.items():
            for keyword in keywords:
                if keyword.lower() in text_lower:
                    features[f'{lang}_spam_keywords'] += 1
        
        # Pattern matching
        for pattern_name, pattern in self.patterns.items():
            matches = pattern.findall(text)
            features[f'{pattern_name}_count'] = len(matches)
        
        # Text statistics
        features['length'] = len(text)
        features['word_count'] = len(text.split())
        features['caps_ratio'] = len(re.findall(r'[A-Z]', text)) / max(len(text), 1)
        features['digit_ratio'] = len(re.findall(r'\d', text)) / max(len(text), 1)
        features['punctuation_ratio'] = len(re.findall(r'[!@#$%^&*(),.?":{}|<>]', text)) / max(len(text), 1)
        
        return dict(features)

    def preprocess_text(self, text):
        """Clean and normalize text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Keep original text for multi-language TF-IDF (no Unicode normalization)
        return text

# Enhanced model training with multi-language support
def create_enhanced_dataset():
    """Create a comprehensive dataset by importing multiple CSV files"""
    print("Loading datasets from CSV files...")
    
    try:
        # Define required files and their column mappings
        datasets = [
            {
                'file': 'emails.csv',
                'text_col': 'Subject',
                'label_col': 'Label',
                'encoding': 'utf-8'
            },
            {
                'file': 'Bangla_Email_Dataset.csv',
                'text_col': 'Text',
                'label_col': 'Label',
                'encoding': 'utf-8'
            },
            {
                'file': 'Dataset_5971.csv',
                'text_col': 'Message',
                'label_col': 'Label',
                'encoding': 'utf-8'
            },
            {
                'file': 'spanish_spam.csv',  # Add your Spanish dataset
                'text_col': 'Mensaje',
                'label_col': 'Etiqueta',
                'encoding': 'utf-8'
            }
        ]
        
        combined_data = {
            'message': [],
            'label': [],
            'language': []
        }
        
        # Load each dataset
        for dataset in datasets:
            if os.path.exists(dataset['file']):
                try:
                    df = pd.read_csv(dataset['file'], encoding=dataset['encoding'])
                    print(f"✅ Loaded {len(df)} records from {dataset['file']}")
                    
                    # Add messages and labels to combined data
                    for _, row in df.iterrows():
                        text = str(row[dataset['text_col']])
                        label = int(row[dataset['label_col']])
                        
                        # Detect language
                        preprocessor = MultiLanguagePreprocessor()
                        language = preprocessor.detect_language(text)
                        
                        combined_data['message'].append(text)
                        combined_data['label'].append(label)
                        combined_data['language'].append(language)
                        
                except Exception as e:
                    print(f"❌ Error loading {dataset['file']}: {e}")
            else:
                print(f"⚠️ File not found: {dataset['file']}")
        
        # Create DataFrame
        df = pd.DataFrame(combined_data)
        
        # Remove duplicates and null values
        df = df.drop_duplicates(subset=['message'])
        df = df.dropna()
        
        # Save combined dataset
        df.to_csv('spam_dataset.csv', index=False)
        
        print(f"\n📊 Dataset Statistics:")
        print(f"Total messages: {len(df)}")
        print(f"Spam messages: {sum(df['label'])}")
        print(f"Ham messages: {len(df) - sum(df['label'])}")
        print("\nLanguage distribution:")
        print(df['language'].value_counts())
        
        return df
        
    except Exception as e:
        print(f"❌ Error creating dataset: {e}")
        return pd.DataFrame()

def load_or_train_model():
    """Load or train model with multi-language support"""
    global tfidf_vectorizer
    print("Training enhanced multi-language spam detection model...")
    
    try:
        # Create or load dataset
        df = create_enhanced_dataset()
        
        if len(df) == 0:
            raise Exception("No data available for training")
        
        # Initialize preprocessor
        preprocessor = MultiLanguagePreprocessor()
        
        # Preprocess texts
        print("Preprocessing texts...")
        df['processed_text'] = df['message'].apply(preprocessor.preprocess_text)
        
        # Extract features
        print("Extracting features...")
        features_list = []
        for text in df['message']:
            features = preprocessor.extract_features(text)
            features_list.append(features)
        
        # Convert features to DataFrame
        features_df = pd.DataFrame(features_list).fillna(0)
        
        # Create TF-IDF vectorizer with multi-language support
        tfidf_vectorizer = TfidfVectorizer(
            max_features=10000,
            ngram_range=(1, 3),
            min_df=2,
            max_df=0.9,
            analyzer='char_wb',  # Character n-grams for better multi-language support
            strip_accents=None,
            lowercase=True
        )
        
        # Create TF-IDF features
        tfidf_features = tfidf_vectorizer.fit_transform(df['processed_text'])
        
        # Combine features
        X = np.hstack([
            tfidf_features.toarray(),
            features_df.select_dtypes(include=[np.number]).values
        ])
        
        y = df['label']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Train model with balanced class weights
        print("Training model...")
        model = RandomForestClassifier(
            n_estimators=200,  # Increased number of trees
            max_depth=20,
            min_samples_split=5,
            class_weight='balanced',
            random_state=42,
            n_jobs=-1
        )
        
        model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"\n📈 Model Performance:")
        print(f"Overall accuracy: {accuracy:.2%}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        # Evaluate by language
        print("\nAccuracy by language:")
        for lang in df['language'].unique():
            mask = df.iloc[y_test.index]['language'] == lang
            if mask.sum() > 0:
                lang_acc = accuracy_score(y_test[mask], y_pred[mask])
                print(f"{lang}: {lang_acc:.2%}")
        
        return model, preprocessor
        
    except Exception as e:
        print(f"❌ Error during model training: {e}")
        return create_fallback_model()

def create_fallback_model():
    """Create a simple fallback model if main training fails"""
    global tfidf_vectorizer
    print("Creating fallback model...")
    
    # Simple model with basic data
    simple_data = {
        'message': [
            'win free money now', 'click here urgent', 'congratulations winner',
            'hello how are you', 'meeting at 3pm', 'thanks for help'
        ],
        'label': [1, 1, 1, 0, 0, 0]
    }
    
    df = pd.DataFrame(simple_data)
    
    tfidf_vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
    
    model = Pipeline([
        ('tfidf', tfidf_vectorizer),
        ('classifier', MultinomialNB())
    ])
    
    model.fit(df['message'], df['label'])
    preprocessor = MultiLanguagePreprocessor()
    
    return model, preprocessor

def calculate_spam_confidence(spam_score, indicators, is_spam):
    """Enhanced confidence calculation"""
    if is_spam:
        # For spam messages: confidence increases with more indicators
        base_confidence = 0.60
        
        # High-value indicators boost confidence more
        high_value_boost = 0
        if indicators.get('phone_numbers', 0) > 0:
            high_value_boost += 0.15
        if indicators.get('money_mentions', 0) > 0:
            high_value_boost += 0.12
        if indicators.get('urls', 0) > 0:
            high_value_boost += 0.10
        if indicators.get('urgent_words', 0) > 0:
            high_value_boost += 0.08
            
        # Keyword density matters
        keyword_boost = min(indicators.get('spam_keywords', 0) * 0.05, 0.15)
        
        confidence = base_confidence + high_value_boost + keyword_boost
        return min(confidence, 0.98)
    else:
        # For non-spam messages: higher confidence when fewer spam indicators
        if spam_score == 0:
            return 0.92  # Very confident for clean messages
        elif spam_score == 1:
            # Check what type of indicator it was
            if indicators.get('spam_keywords', 0) > 0 and indicators.get('phone_numbers', 0) == 0:
                return 0.75  # Keywords alone might be false positive
            else:
                return 0.65  # Other single indicators are more concerning
        elif spam_score == 2:
            return 0.58  # Close to spam threshold, low confidence
        else:
            return 0.52  # Very close to being classified as spam

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
            data = jwt.decode(
                jwt=token,
                key=app.config['SECRET_KEY'],
                algorithms=["HS256"]
            )
            
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
        
        # Generate JWT token with timezone-aware datetime
        token_payload = {
            'user_id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.now(timezone.utc) + timedelta(seconds=app.config['JWT_EXPIRATION'])
        }
        
        # Use jwt.encode with explicit algorithm
        token = jwt.encode(
            payload=token_payload,
            key=app.config['SECRET_KEY'],
            algorithm="HS256"
        )
        
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
    try:
        data = request.get_json()
        
        if not data or not data.get('message'):
            return jsonify({'error': 'No message provided'}), 400
            
        message = data.get('message')
        message_type = data.get('type', 'email')

        # Initialize preprocessor if needed
        global spam_model, text_preprocessor, tfidf_vectorizer
        
        # Check if ML model is available
        use_ml_model = spam_model is not None and text_preprocessor is not None and tfidf_vectorizer is not None
        
        if use_ml_model:
            try:
                # Use ML model for prediction
                processed_text = text_preprocessor.preprocess_text(message)
                features = text_preprocessor.extract_features(message)
                
                # Create TF-IDF features
                tfidf_features = tfidf_vectorizer.transform([processed_text])
                
                # Combine features (ensure consistent feature count)
                feature_values = []
                for key in sorted(features.keys()):
                    if isinstance(features[key], (int, float)):
                        feature_values.append(features[key])
                
                if hasattr(spam_model, 'predict_proba'):
                    # For scikit-learn models
                    X = np.hstack([tfidf_features.toarray(), np.array([feature_values])])
                    prediction = spam_model.predict(X)[0]
                    probabilities = spam_model.predict_proba(X)[0]
                    confidence = float(probabilities[1] if prediction else probabilities[0])
                else:
                    # For pipeline models
                    prediction = spam_model.predict([processed_text])[0]
                    probabilities = spam_model.predict_proba([processed_text])[0]
                    confidence = float(probabilities[1] if prediction else probabilities[0])
                
                is_spam = bool(prediction)
                language = text_preprocessor.detect_language(message)
                
                # Create indicators from features
                indicators = {
                    'spam_keywords': features.get('bangla_spam_keywords', 0) + features.get('english_spam_keywords', 0),
                    'phone_numbers': features.get('phone_count', 0),
                    'money_mentions': features.get('money_bangla_count', 0) + features.get('money_english_count', 0),
                    'urgent_words': features.get('urgent_bangla_count', 0) + features.get('urgent_english_count', 0),
                    'urls': features.get('urls_count', 0),
                    'text_length': features.get('length', len(message))
                }
                
                result = {
                    'isSpam': is_spam,
                    'confidence': confidence,
                    'message': 'Spam detected' if is_spam else 'Not spam',
                    'language': language,
                    'indicators': indicators
                }
                
            except Exception as ml_error:
                print(f"ML model error: {ml_error}, falling back to rule-based detection")
                use_ml_model = False
        
        if not use_ml_model:
            # Use rule-based detection as fallback
            print("Using rule-based detection")
            
            # Detect language and preprocess
            is_bangla = any('\u0980' <= c <= '\u09FF' for c in message)
            language = 'bangla' if is_bangla else 'english'
            
            # Spam detection logic
            spam_score = 0
            indicators = {
                'spam_keywords': 0,
                'phone_numbers': 0,
                'money_mentions': 0,
                'urgent_words': 0,
                'urls': 0,
                'text_length': len(message)
            }
            
            message_lower = message.lower()

            if is_bangla:
                # Bangla spam detection
                bangla_spam_keywords = [
                    'বিনামূল্যে', 'ফ্রি', 'জিতুন', 'পুরস্কার', 'লটারি', 'টাকা', 'অফার',
                    'ছাড়', 'জরুরি', 'এখনই', 'ক্লিক', 'কল করুন', 'গ্যারান্টি', 'বিজয়ী',
                    'লাভজনক', 'সুযোগ', 'সীমিত', 'দ্রুত', 'নিশ্চিত', 'জিতেছেন', 'পেতে',
                    'রিচার্জ', 'লক্ষ', 'হাজার', 'কোটি', 'একাউন্ট', 'বন্ধ', 'সমস্যা'
                ]
                
                # Check for Bangla spam keywords
                for keyword in bangla_spam_keywords:
                    if keyword.lower() in message_lower:
                        spam_score += 1
                        indicators['spam_keywords'] += 1

                # Check for phone numbers
                phone_patterns = [
                    r'(\+?88)?[-\s]?01[3-9]\d{8}',  # Bangla mobile numbers
                    r'[০-৯]{11}'  # Bangla numeric mobile numbers
                ]
                for pattern in phone_patterns:
                    if re.search(pattern, message):
                        spam_score += 2  # Phone numbers are strong indicators
                        indicators['phone_numbers'] += 1

                # Check for money mentions
                money_patterns = [
                    r'৳\s*[\d০-৯]+',
                    r'[\d০-৯]+\s*(টাকা|হাজার|লক্ষ|লাখ|কোটি)'
                ]
                for pattern in money_patterns:
                    if re.search(pattern, message):
                        spam_score += 2  # Money mentions are strong indicators
                        indicators['money_mentions'] += 1

                # Check for urgent words
                urgent_words = ['জরুরি', 'এখনই', 'তাড়াতাড়ি', 'দ্রুত', 'অবিলম্বে']
                for word in urgent_words:
                    if word.lower() in message_lower:
                        spam_score += 1
                        indicators['urgent_words'] += 1

            else:
                # English spam detection
                english_spam_keywords = [
                    'free', 'win', 'winner', 'cash', 'prize', 'urgent', 'offer',
                    'limited', 'click', 'call now', 'guarantee', 'discount',
                    'congratulation', 'lucky', 'selected', 'money', 'loan',
                    'credit', 'debt', 'bonus', 'reward', 'exclusive'
                ]
                
                # Check for English spam keywords
                for keyword in english_spam_keywords:
                    if keyword.lower() in message_lower:
                        spam_score += 1
                        indicators['spam_keywords'] += 1

                # Check for phone numbers
                if re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', message):
                    spam_score += 2  # Phone numbers are strong indicators
                    indicators['phone_numbers'] += 1

                # Check for money mentions
                if re.search(r'[$€£]\s*\d+|\d+\s*(?:dollars|euro|pound|USD|EUR|GBP)', message_lower):
                    spam_score += 2  # Money mentions are strong indicators
                    indicators['money_mentions'] += 1

                # Check for urgent words
                urgent_words = ['urgent', 'now', 'hurry', 'limited time', 'act now', 'today only']
                for word in urgent_words:
                    if word.lower() in message_lower:
                        spam_score += 1
                        indicators['urgent_words'] += 1

            # Check for URLs in both languages
            if re.search(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', message):
                spam_score += 2  # URLs are strong indicators
                indicators['urls'] += 1

            # Enhanced spam determination logic
            if spam_score >= 4:
                is_spam = True
            elif spam_score >= 3:
                # Check if high-value indicators are present
                high_value_indicators = indicators['phone_numbers'] + indicators['money_mentions'] + indicators['urls']
                is_spam = high_value_indicators >= 1
            elif spam_score >= 2:
                # Need at least one high-value indicator
                high_value_indicators = indicators['phone_numbers'] + indicators['money_mentions'] + indicators['urls']
                is_spam = high_value_indicators >= 1 and indicators['spam_keywords'] >= 1
            else:
                is_spam = False

            # Calculate confidence using the enhanced function
            confidence = calculate_spam_confidence(spam_score, indicators, is_spam)

            result = {
                'isSpam': is_spam,
                'confidence': confidence,
                'message': 'Spam detected' if is_spam else 'Not spam',
                'language': language,
                'indicators': indicators
            }

        # Save to database
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                """INSERT INTO messages 
                   (user_id, content, type, language, is_spam, confidence, spam_indicators) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s)""",
                (current_user['id'], message, message_type, result['language'],
                 result['isSpam'], result['confidence'], json.dumps(result['indicators']))
            )
            conn.commit()
            cursor.close()
            conn.close()
        except Exception as db_error:
            print(f"Database error: {db_error}")

        return jsonify(result), 200

    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({
            'error': 'Error detecting spam',
            'details': str(e)
        }), 500

# Admin routes
@app.route('/api/admin/stats', methods=['GET'])
@token_required
@admin_required
def admin_stats(current_user):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get total users
        cursor.execute("SELECT COUNT(*) as total FROM users")
        total_users = cursor.fetchone()['total']
        
        # Get total messages
        cursor.execute("SELECT COUNT(*) as total FROM messages")
        total_messages = cursor.fetchone()['total']
        
        # Get spam and ham counts
        cursor.execute("""
            SELECT 
                COUNT(*) FILTER (WHERE is_spam = true) as spam_count,
                COUNT(*) FILTER (WHERE is_spam = false) as ham_count
            FROM messages
        """)
        counts = cursor.fetchone()
        
        # Get messages by type
        cursor.execute("""
            SELECT type, COUNT(*) as count 
            FROM messages 
            GROUP BY type
        """)
        messages_by_type = {row['type']: row['count'] for row in cursor.fetchall()}
        
        # Get recent activity
        cursor.execute("""
            SELECT 
                m.id,
                m.content,
                m.type,
                m.is_spam,
                m.confidence,
                m.created_at,
                json_build_object(
                    'id', u.id,
                    'name', u.name,
                    'email', u.email
                ) as user
            FROM messages m
            JOIN users u ON m.user_id = u.id
            ORDER BY m.created_at DESC
            LIMIT 10
        """)
        recent_activity = cursor.fetchall()
        
        # Get message trends (last 7 days)
        cursor.execute("""
            SELECT 
                DATE(created_at) as date,
                COUNT(*) FILTER (WHERE is_spam = true) as spam_count,
                COUNT(*) FILTER (WHERE is_spam = false) as clean_count
            FROM messages
            WHERE created_at >= NOW() - INTERVAL '7 days'
            GROUP BY DATE(created_at)
            ORDER BY date
        """)
        trends = cursor.fetchall()
        
        # Calculate detection accuracy by channel
        cursor.execute("""
            SELECT 
                type,
                AVG(CASE WHEN confidence >= 0.8 THEN 1 ELSE 0 END) * 100 as accuracy
            FROM messages
            GROUP BY type
        """)
        accuracy_by_channel = {row['type']: float(row['accuracy']) for row in cursor.fetchall()}
        
        stats = {
            'totalUsers': total_users,
            'totalMessages': total_messages,
            'spamCount': counts['spam_count'],
            'hamCount': counts['ham_count'],
            'messagesByType': {
                'email': messages_by_type.get('email', 0),
                'sms': messages_by_type.get('sms', 0),
                'social': messages_by_type.get('social', 0)
            },
            'recentActivity': [dict(activity) for activity in recent_activity],
            'messagesByPeriod': [dict(trend) for trend in trends],
            'accuracyByChannel': accuracy_by_channel,
            'detectionRate': (counts['spam_count'] / total_messages * 100) if total_messages > 0 else 0
        }
        
        cursor.close()
        conn.close()
        
        return jsonify(stats), 200
        
    except Exception as e:
        print(f"Error fetching admin stats: {str(e)}")
        return jsonify({
            'error': 'Failed to fetch dashboard statistics',
            'details': str(e)
        }), 500

@app.route('/api/admin/retrain', methods=['POST'])
@token_required
@admin_required
def retrain_model(current_user):
    """Endpoint to retrain the model"""
    try:
        global spam_model, text_preprocessor, tfidf_vectorizer
        
        print("Retraining model...")
        spam_model, text_preprocessor = load_or_train_model()
        
        return jsonify({
            'message': 'Model retrained successfully',
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Retraining failed', 'error': str(e)}), 500

@app.route('/api/admin/retrain-with-csv', methods=['POST'])
@token_required
@admin_required
def retrain_with_csv(current_user):
    try:
        print("Starting CSV data retraining process...")
        
        # Check if CSV files exist first
        required_files = ['emails.csv', 'Bangla_Email_Dataset.csv', 'Dataset_5971.csv', 'spam_dataset.csv']
        missing_files = [f for f in required_files if not os.path.exists(f)]
        
        if missing_files:
            raise Exception(f"Missing CSV files: {', '.join(missing_files)}")
        
        # Force recreation of dataset
        if os.path.exists('spam_dataset.csv'):
            os.remove('spam_dataset.csv')
            print("Removed existing dataset file")
        
        # Create new dataset
        df = create_enhanced_dataset()
        if len(df) == 0:
            raise Exception("Dataset is empty after loading CSV files")
            
        print(f"Created new dataset with {len(df)} records")
        
        # Train new model
        global spam_model, text_preprocessor, tfidf_vectorizer
        spam_model, text_preprocessor = load_or_train_model()
        
        return jsonify({
            'message': 'Model retrained successfully with CSV data',
            'dataset_size': len(df),
            'spam_count': int(sum(df['label'])),
            'ham_count': int(len(df) - sum(df['label'])),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }), 200
        
    except Exception as e:
        print(f"Retraining error: {str(e)}")
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/api/admin/model-info', methods=['GET'])
@token_required
@admin_required
def get_model_info(current_user):
    """Get information about the current model"""
    global spam_model, text_preprocessor, tfidf_vectorizer
    
    info = {
        'model_loaded': spam_model is not None,
        'preprocessor_loaded': text_preprocessor is not None,
        'tfidf_loaded': tfidf_vectorizer is not None,
        'supported_languages': ['english', 'bangla', 'mixed'],
        'supported_types': ['email', 'sms', 'social'],
        'last_trained': datetime.now(timezone.utc).isoformat()
    }
    
    return jsonify(info), 200

@app.route('/api/admin/check-csv-files', methods=['GET'])
@token_required
@admin_required
def check_csv_files(current_user):
    try:
        required_files = ['emails.csv', 'Bangla_Email_Dataset.csv', 'Dataset_5971.csv']
        missing_files = []
        existing_files = []
        
        for file in required_files:
            if not os.path.exists(file):
                missing_files.append(file)
            else:
                existing_files.append(file)
        
        return jsonify({
            'all_files_exist': len(missing_files) == 0,
            'existing_files': existing_files,
            'missing_files': missing_files,
            'working_directory': os.getcwd()
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Error checking CSV files'
        }), 500

@app.route('/api/admin/badge-counts', methods=['GET'])
@token_required
@admin_required
def get_badge_counts(current_user):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get new users in last 24 hours
        cursor.execute("""
            SELECT COUNT(*) as count 
            FROM users 
            WHERE created_at >= NOW() - INTERVAL '24 hours'
        """)
        new_users = cursor.fetchone()['count']
        
        # Get new messages in last 24 hours
        cursor.execute("""
            SELECT COUNT(*) as count 
            FROM messages 
            WHERE created_at >= NOW() - INTERVAL '24 hours'
        """)
        new_messages = cursor.fetchone()['count']
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'users': new_users,
            'messages': new_messages
        }), 200
        
    except Exception as e:
        print(f"Error fetching badge counts: {e}")
        return jsonify({'users': 0, 'messages': 0}), 200

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

@app.route('/api/admin/messages', methods=['GET'])
@token_required
@admin_required
def get_messages(current_user):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT m.id, m.content, m.type, m.language, m.is_spam, m.confidence, 
                   m.created_at,
                   json_build_object('id', u.id, 'name', u.name, 'email', u.email) as user
            FROM messages m
            JOIN users u ON m.user_id = u.id
            ORDER BY m.created_at DESC
            LIMIT 100
        """
        
        cursor.execute(query)
        messages = cursor.fetchall()
        
        # Convert decimal values to float for JSON serialization
        for message in messages:
            if 'confidence' in message and message['confidence'] is not None:
                message['confidence'] = float(message['confidence'])
        
        cursor.close()
        conn.close()
        
        return jsonify(messages), 200
    
    except Exception as e:
        print(f"Error fetching messages: {e}")
        return jsonify({
            'error': 'Failed to fetch messages',
            'details': str(e)
        }), 500

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

@app.route('/api/admin/users', methods=['POST'])
@token_required
@admin_required
def create_user(current_user):
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'user')

        if not all([name, email, password]):
            return jsonify({'message': 'Missing required fields'}), 400

        hashed_password = generate_password_hash(password)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO users (name, email, password, role)
            VALUES (%s, %s, %s, %s)
            RETURNING id, name, email, role, created_at
        """, (name, email, hashed_password, role))
        
        new_user = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            'id': new_user[0],
            'name': new_user[1],
            'email': new_user[2],
            'role': new_user[3],
            'created_at': new_user[4]
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    global spam_model, text_preprocessor, tfidf_vectorizer
    
    return jsonify({
        'status': 'healthy',
        'model_loaded': spam_model is not None,
        'preprocessor_loaded': text_preprocessor is not None,
        'tfidf_loaded': tfidf_vectorizer is not None,
        'timestamp': datetime.now(timezone.utc).isoformat()
    }), 200

# Test prediction endpoint (no auth required for testing)
@app.route('/api/test-predict', methods=['POST'])
def test_predict():
    """Test endpoint for prediction without authentication"""
    data = request.get_json()
    message = data.get('message', '')
    message_type = data.get('type', 'email')
    
    if not message:
        return jsonify({'error': 'No message provided'}), 400
    
    # Mock current_user for testing
    mock_user = {'id': 1}
    
    try:
        # Call the same prediction logic as the main endpoint
        return predict_spam(mock_user)
    except Exception as e:
        return jsonify({
            'error': 'Test prediction failed',
            'details': str(e)
        }), 500

# Initialize everything on startup
def initialize_app():
    """Initialize the application with database and model"""
    global spam_model, text_preprocessor, tfidf_vectorizer
    
    print("🚀 Initializing Enhanced Spam Detection App...")
    
    try:
        # Initialize database
        print("📊 Initializing database...")
        init_db()
        print("✅ Database initialized successfully")
        
        # Load/train model
        print("🤖 Loading/Training ML model...")
        spam_model, text_preprocessor = load_or_train_model()
        print("✅ Model loaded successfully")
        
        # Test the model
        test_messages = [
            ("Win free money now! Call 123-456-7890", "English spam"),
            ("আপনি ১ লক্ষ টাকা জিতেছেন! এখনই কল করুন", "Bangla spam"), 
            ("বিনামূল্যে মোবাইল রিচার্জ পেতে চান? এসএমএস করুন FREE লিখে ৩৩৩৩৩ নম্বরে", "Bangla spam"),
            ("জরুরি! আপনার অ্যাকাউন্ট বন্ধ হয়ে যাবে। এখনই ক্লিক করুন", "Bangla spam"),
            ("Hello, how are you doing today?", "English ham"),
            ("আজকে অফিসে আসবেন না কেন?", "Bangla ham"),
            ("Meeting at 3 PM tomorrow", "English ham"),
            ("কাল সকালে ক্লাস আছে", "Bangla ham")
        ]
        
        print("\n🧪 Testing model with sample messages:")
        for msg, expected in test_messages:
            # Use rule-based prediction for testing
            is_bangla = any('\u0980' <= c <= '\u09FF' for c in msg)
            spam_score = 0
            
            if is_bangla:
                bangla_keywords = ['বিনামূল্যে', 'ফ্রি', 'জিতুন', 'জরুরি', 'এখনই', 'টাকা', 'কল করুন']
                for kw in bangla_keywords:
                    if kw in msg:
                        spam_score += 1
            else:
                english_keywords = ['free', 'win', 'money', 'call', 'urgent', 'now']
                for kw in english_keywords:
                    if kw.lower() in msg.lower():
                        spam_score += 1
                        
            # Check for phone numbers
            if re.search(r'(\d{3}[-.]?\d{3}[-.]?\d{4}|01[3-9]\d{8})', msg):
                spam_score += 2
                
            is_spam = spam_score >= 2
            confidence = calculate_spam_confidence(spam_score, {'spam_keywords': spam_score}, is_spam)
            
            status = "✅" if (is_spam and "spam" in expected) or (not is_spam and "ham" in expected) else "❌"
            print(f"   {status} Message: '{msg[:50]}{'...' if len(msg) > 50 else ''}'")
            print(f"       Expected: {expected}")
            print(f"       Result: {'SPAM' if is_spam else 'HAM'} ({confidence:.1%} confidence)")
            print(f"       Score: {spam_score}")
        
    except Exception as e:
        print(f"❌ Error during initialization: {e}")
        print("⚠️  App may not function properly, but rule-based detection will work")

# Application startup
if __name__ == '__main__':
    # Initialize the app
    initialize_app()
    
    # Run the Flask app
    port = int(os.environ.get('PORT', 5000))
    print(f"\n🌐 Starting server on http://0.0.0.0:{port}")
    print("📝 Admin credentials: admin@example.com / admin123")
    print("Press Ctrl+C to stop the server")
    
    app.run(host='0.0.0.0', port=port, debug=True)
