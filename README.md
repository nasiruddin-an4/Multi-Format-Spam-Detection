# Spam Shield - Full-Stack Spam Detection Web App

A comprehensive spam detection platform that uses machine learning to identify unwanted messages from email, SMS, and social media.

## Features

- Spam detection across multiple message types (Email, SMS, Social Media)
- Machine learning powered detection using TF-IDF and Naive Bayes
- Secure user authentication with registration and login
- Admin dashboard to manage users and view message logs
- PostgreSQL database for storing users and message history
- Modern, responsive UI with Tailwind CSS

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios for API calls
- JWT for authentication

### Backend
- Python Flask
- Scikit-learn for machine learning
- PostgreSQL (via Neon Cloud)
- JWT for secure authentication

## Getting Started

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- PostgreSQL database

### Frontend Setup
1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following content:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables (or use defaults):
   - `DATABASE_URL`: PostgreSQL connection string
   - `SECRET_KEY`: Secret key for JWT token generation
   - `PORT`: Port number (default: 5000)

5. Run the Flask app:
   ```
   python app.py
   ```

## Deployment

### Frontend
Deploy to Netlify or Vercel:
1. Build the app: `npm run build`
2. Deploy the `dist` directory

### Backend
Deploy to Render or Railway:
1. Connect to your GitHub repository
2. Use the following build command: `pip install -r requirements.txt`
3. Use the following start command: `gunicorn app:app`

### Database
1. Create a PostgreSQL database on Neon Cloud
2. Update the `DATABASE_URL` environment variable in your backend deployment

## Default Admin Account
- Email: admin@example.com
- Password: admin123

## License
This project is licensed under the MIT License - see the LICENSE file for details.