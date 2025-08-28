# Spam Detection Backend

This is the backend for the Spam Detection application. It's built with Flask and provides API endpoints for spam detection, user authentication, and admin functionality.

## Features

- Spam detection using scikit-learn and TF-IDF
- User authentication with JWT
- Admin dashboard API endpoints
- PostgreSQL database integration

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Set environment variables:
   - `DATABASE_URL`: PostgreSQL connection string (default: postgresql://postgres:postgres@localhost:5432/spam_detection)
   - `SECRET_KEY`: Secret key for JWT token generation
   - `PORT`: Port number (default: 5000)

4. Run the application:
   ```
   python app.py
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login and get JWT token

### Spam Detection
- POST `/api/predict` - Predict if a message is spam

### Admin Endpoints
- GET `/api/admin/stats` - Get admin dashboard statistics
- GET `/api/admin/users` - Get all users
- DELETE `/api/admin/users/:id` - Delete a user
- GET `/api/admin/messages` - Get all messages (with optional filters)

## Deployment

The backend is ready to be deployed to Render or Railway using the included Procfile.