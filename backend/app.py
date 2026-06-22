from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
import json
from model_predictor import LearningStylePredictor
import logging
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from passlib.hash import bcrypt
from datetime import datetime, timedelta
import secrets

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Enable CORS for all routes and allow credentials (cookies)
CORS(app, supports_credentials=True)
# Accept both with and without trailing slashes
app.url_map.strict_slashes = False

# Load env and connect MongoDB
load_dotenv()
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
MONGODB_DB = os.getenv('MONGODB_DB', 'sgp3')

mongo_client = MongoClient(MONGODB_URI)
db = mongo_client[MONGODB_DB]
users_col = db['users']
sessions_col = db['sessions']
user_attempts_col = db['user_attempts']

# Ensure indexes
try:
    users_col.create_index('email', unique=True)
    sessions_col.create_index('sessionId', unique=True)
    # TTL on expiresAt; documents auto-removed after expiration
    sessions_col.create_index('expiresAt', expireAfterSeconds=0)
    user_attempts_col.create_index('email', unique=True)
except Exception as e:
    logger.warning(f"Mongo index creation warning: {e}")

SESSION_COOKIE_NAME = 'sessionId'

# Initialize the predictor
try:
    predictor = LearningStylePredictor()
    logger.info("Learning Style Predictor initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize predictor: {e}")
    predictor = None

@app.route('/')
def home():
    """Home endpoint with API information"""
    return jsonify({
        'message': 'Learning Style Prediction API',
        'version': '1.0.0',
        'endpoints': {
            '/': 'API information',
            '/predict': 'Make learning style predictions',
            '/model-info': 'Get model information',
            '/health': 'Health check'
        },
        'usage': {
            'POST /predict': 'Send user data to get learning style prediction',
            'POST /auth/signup': 'Create a new user {name, email, password}',
            'POST /auth/login-cookie': 'Login with email/password and receive session cookie',
            'GET /auth/me-cookie': 'Get current user via session cookie',
            'POST /auth/logout': 'Logout and clear session cookie',
            'GET /model-info': 'Get information about available models',
            'GET /health': 'Check if the API is running'
        }
    })

@app.route('/health')
def health_check():
    """Health check endpoint"""
    if predictor is None:
        return jsonify({'status': 'error', 'message': 'Models not loaded'}), 500
    
    return jsonify({
        'status': 'healthy',
        'message': 'Learning Style Prediction API is running',
        'models_loaded': True,
        'database': 'connected'
    })

# --------- AUTH HELPERS ---------
def _set_session_cookie(resp, session_id: str, days: int = 7):
    max_age = days * 24 * 60 * 60
    resp.set_cookie(
        SESSION_COOKIE_NAME,
        session_id,
        max_age=max_age,
        httponly=True,
        samesite='Lax'
    )

def _clear_session_cookie(resp):
    resp.delete_cookie(SESSION_COOKIE_NAME)

def _current_user_from_cookie():
    session_id = request.cookies.get(SESSION_COOKIE_NAME)
    if not session_id:
        return None
    sess = sessions_col.find_one({'sessionId': session_id})
    if not sess:
        return None
    if sess.get('expiresAt') and sess['expiresAt'] < datetime.utcnow():
        # expired, cleanup
        sessions_col.delete_one({'_id': sess['_id']})
        return None
    user = users_col.find_one({'_id': sess['userId']})
    return user

# --------- AUTH ROUTES ---------
@app.route('/auth/signup', methods=['POST', 'OPTIONS'])
def auth_signup():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not name or not email or not password:
        return jsonify({'error': 'name, email, password are required'}), 400
    if len(name) > 100:
        return jsonify({'error': 'name too long'}), 400

    hashed = bcrypt.hash(password)
    doc = {
        'name': name,
        'email': email,
        'hashed_password': hashed,
        'role': data.get('role') or 'Student',
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
    }
    try:
        users_col.insert_one(doc)
    except DuplicateKeyError:
        return jsonify({'error': 'Email already exists'}), 409

    return jsonify({'status': 'created'}), 201

@app.route('/auth/login-cookie', methods=['POST', 'OPTIONS'])
def auth_login_cookie():
    data = request.get_json() or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    user = users_col.find_one({'email': email})
    if not user or not bcrypt.verify(password, user.get('hashed_password', '')):
        return jsonify({'error': 'Invalid credentials'}), 401
    # Create session
    session_id = secrets.token_urlsafe(32)
    expires = datetime.utcnow() + timedelta(days=7)
    sessions_col.insert_one({
        'sessionId': session_id,
        'userId': user['_id'],
        'createdAt': datetime.utcnow(),
        'expiresAt': expires,
        'ip': request.remote_addr,
        'userAgent': request.headers.get('User-Agent')
    })
    resp = make_response('', 204)
    _set_session_cookie(resp, session_id, days=7)
    return resp

# --------- PROFILE ROUTES ---------
@app.route('/auth/profile', methods=['GET'])
def get_profile():
    user = _current_user_from_cookie()
    if not user:
        return jsonify({'error': 'Not authenticated'}), 401
    dob = user.get('dateOfBirth')
    dob_str = dob.strftime("%d-%m-%Y") if isinstance(dob, datetime) else dob
    return jsonify({
        'name': user.get('name'),
        'email': user.get('email'),
        'role': user.get('role', 'Student'),
        'dateOfBirth': dob_str,
        'phoneNumber': user.get('phoneNumber')
    })

@app.route('/auth/profile', methods=['PATCH', 'OPTIONS'])
def update_profile():
    user = _current_user_from_cookie()
    if not user:
        return jsonify({'error': 'Not authenticated'}), 401

    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    date_of_birth = data.get('dateOfBirth')  # Expect dd-mm-yyyy (preferred) or YYYY-MM-DD/ISO
    phone_number = (data.get('phoneNumber') or '').strip()

    update_fields = {}
    if name:
        update_fields['name'] = name
    if email and email != user.get('email'):
        # Ensure new email is unique
        exists = users_col.find_one({'email': email, '_id': {'$ne': user['_id']}})
        if exists:
            return jsonify({'error': 'Email already in use'}), 409
        update_fields['email'] = email
    if date_of_birth:
        # Try parse to datetime (stored as BSON Date); accept dd-mm-yyyy (preferred) and yyyy-mm-dd/ISO
        dob_dt = None
        try:
            if isinstance(date_of_birth, str):
                if len(date_of_birth) == 10 and date_of_birth[2] == '-':
                    # dd-mm-yyyy
                    dob_dt = datetime.strptime(date_of_birth, "%d-%m-%Y")
                elif len(date_of_birth) == 10 and date_of_birth[4] == '-':
                    # yyyy-mm-dd
                    dob_dt = datetime.strptime(date_of_birth, "%Y-%m-%d")
                else:
                    dob_dt = datetime.fromisoformat(date_of_birth)
        except Exception:
            return jsonify({'error': 'Invalid dateOfBirth format. Use dd-mm-yyyy'}), 400
        if dob_dt:
            update_fields['dateOfBirth'] = dob_dt
    if phone_number:
        update_fields['phoneNumber'] = phone_number

    if not update_fields:
        return jsonify({'error': 'No changes provided'}), 400

    update_fields['updatedAt'] = datetime.utcnow()
    users_col.update_one({'_id': user['_id']}, {'$set': update_fields})

    # Reload updated user
    updated = users_col.find_one({'_id': user['_id']})
    udob = updated.get('dateOfBirth')
    udob_str = udob.strftime("%d-%m-%Y") if isinstance(udob, datetime) else udob
    return jsonify({
        'name': updated.get('name'),
        'email': updated.get('email'),
        'role': updated.get('role', 'Student'),
        'dateOfBirth': udob_str,
        'phoneNumber': updated.get('phoneNumber')
    })

@app.route('/auth/me-cookie', methods=['GET'])
def auth_me_cookie():
    user = _current_user_from_cookie()
    if not user:
        return jsonify({'error': 'Not authenticated'}), 401
    dob = user.get('dateOfBirth')
    dob_str = dob.isoformat()[:10] if isinstance(dob, datetime) else dob
    return jsonify({
        'name': user['name'],
        'email': user['email'],
        'role': user.get('role', 'Student'),
        'dateOfBirth': dob_str,
        'phoneNumber': user.get('phoneNumber')
    })

@app.route('/auth/logout', methods=['POST', 'OPTIONS'])
def auth_logout():
    session_id = request.cookies.get(SESSION_COOKIE_NAME)
    if session_id:
        sessions_col.delete_one({'sessionId': session_id})
    resp = make_response('', 204)
    _clear_session_cookie(resp)
    return resp

# ------------------- ADMIN ENDPOINTS -------------------
def _require_admin():
    usr = _current_user_from_cookie()
    if not usr:
        return None, (jsonify({'error': 'Not authenticated'}), 401)
    if usr.get('role') != 'Admin':
        return None, (jsonify({'error': 'Forbidden'}), 403)
    return usr, None

@app.route('/admin/stats', methods=['GET'])
def admin_stats():
    usr, err = _require_admin()
    if err:
        return err
    try:
        total_users = users_col.count_documents({})
        recent_users = list(users_col.find({}, {'_id': 0, 'name': 1, 'email': 1, 'createdAt': 1}).sort('createdAt', -1).limit(5))
        return jsonify({'status': 'success', 'data': {
            'totalUsers': total_users,
            'recentUsers': recent_users
        }})
    except Exception as e:
        logger.error(f"Admin stats error: {e}")
        return jsonify({'error': 'Failed to fetch stats'}), 500

@app.route('/admin/users', methods=['GET'])
def admin_users_search():
    usr, err = _require_admin()
    if err:
        return err
    q = (request.args.get('query') or '').strip()
    criteria = {}
    if q:
        criteria = {'$or': [
            {'name': {'$regex': q, '$options': 'i'}},
            {'email': {'$regex': q, '$options': 'i'}}
        ]}
    rows = list(users_col.find(criteria, {'_id': 0, 'name': 1, 'email': 1, 'createdAt': 1, 'role': 1}).sort('createdAt', -1).limit(50))
    return jsonify({'status': 'success', 'data': rows})

@app.route('/admin/user-style', methods=['GET'])
def admin_user_style():
    usr, err = _require_admin()
    if err:
        return err
    email = (request.args.get('email') or '').strip().lower()
    if not email:
        return jsonify({'error': 'email is required'}), 400
    doc = user_attempts_col.find_one({'email': email}, {'_id': 0})
    if not doc or not doc.get('attempts'):
        return jsonify({'status': 'success', 'data': None})
    latest = doc['attempts'][-1]
    return jsonify({'status': 'success', 'data': {
        'name': doc.get('name'),
        'email': doc.get('email'),
        'latestAttempt': latest
    }})

@app.route('/admin/style-distribution', methods=['GET'])
def admin_style_distribution():
    usr, err = _require_admin()
    if err:
        return err
    try:
        pipeline = [
            { '$match': { 'attempts.0': { '$exists': True } } },
            { '$project': {
                'latest': { '$arrayElemAt': [ '$attempts', { '$subtract': [ { '$size': '$attempts' }, 1 ] } ] }
            }},
            { '$project': {
                'style': { '$ifNull': [ '$latest.learningStyle', '$latest.modelResult.random_forest.prediction' ] }
            }},
            { '$group': { '_id': '$style', 'count': { '$sum': 1 } } },
            { '$sort': { 'count': -1 } }
        ]
        rows = list(user_attempts_col.aggregate(pipeline))
        total = sum(r.get('count', 0) for r in rows) or 1
        data = [
            {
                'style': (r.get('_id') or 'Unknown'),
                'count': r.get('count', 0),
                'percent': round((r.get('count', 0) / total) * 100, 1)
            }
            for r in rows
        ]
        return jsonify({ 'status': 'success', 'data': { 'total': total if total != 1 else sum(r.get('count', 0) for r in rows), 'distribution': data } })
    except Exception as e:
        logger.error(f"Admin style distribution error: {e}")
        return jsonify({'error': 'Failed to compute distribution'}), 500

# Quick endpoint to verify auth routing
@app.route('/auth/ping', methods=['GET'])
def auth_ping():
    return jsonify({'status': 'ok'}), 200

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get information about the trained models"""
    if predictor is None:
        return jsonify({'error': 'Models not loaded'}), 500
    
    try:
        info = predictor.get_model_info()
        return jsonify({
            'status': 'success',
            'data': info
        })
    except Exception as e:
        logger.error(f"Error getting model info: {e}")
        return jsonify({'error': str(e)}), 500

# --------- QUIZ ATTEMPTS (persist results per user) ---------
@app.route('/quiz/attempt', methods=['POST'])
def quiz_attempt():
    """
    Accepts a quiz submission payload, runs the ML predictor, and appends the result
    to the user's attempts document. If the user is logged in (cookie session), we use
    that identity; otherwise, we require name/email in the body.

    Expected JSON body includes demographics and Likert features as required by /predict.
    Optionally include "name" and "email" when not authenticated.
    """
    if predictor is None:
        return jsonify({'error': 'Models not loaded'}), 500

    data = request.get_json() or {}

    # Try resolve user from cookie session first
    user = _current_user_from_cookie()
    name = None
    email = None
    if user:
        name = user.get('name')
        email = user.get('email')
    else:
        name = (data.get('name') or '').strip()
        email = (data.get('email') or '').strip().lower()

    if not email:
        return jsonify({'error': 'email is required (login or provide in body)'}), 400
    if not name:
        # fallback to part before @ if not provided
        name = email.split('@')[0] if '@' in email else email

    try:
        # Run prediction using the same logic as /predict
        predictions = predictor.predict(data, 'random_forest')
        results = {}
        for model_name, prediction_data in predictions.items():
            style = prediction_data['prediction']
            description = predictor.get_learning_style_description(style)
            results[model_name] = {
                'prediction': prediction_data['prediction'],
                'probabilities': prediction_data['probabilities'],
                'confidence': prediction_data['confidence'],
                'description': description
            }

        # Build demographics subset in the requested format
        demographics = {
            'Age': data.get('Age'),
            'Age_Group': data.get('Age_Group'),
            'Gender': data.get('Gender'),
            'Education_Level': data.get('Education_Level'),
            'Preferred_Study_Time': data.get('Preferred_Study_Time'),
            'Learning_Goal': data.get('Learning_Goal'),
            'Language_Preference': data.get('Language_Preference'),
        }

        learning_style = results.get('random_forest', {}).get('prediction')
        attempt_doc = {
            'submittedAt': datetime.utcnow(),
            'learningStyle': learning_style,
            'demographics': demographics,
            'modelResult': results,
        }

        # Append attempt to per-user doc and increment totalAttempts
        user_attempt = user_attempts_col.find_one({'email': email})
        if not user_attempt:
            base_doc = {
                'name': name,
                'email': email,
                'totalAttempts': 0,
                'attempts': []
            }
            user_attempts_col.insert_one(base_doc)

        update = {
            '$set': {'name': name, 'email': email},
            '$push': {'attempts': attempt_doc},
            '$inc': {'totalAttempts': 1}
        }
        user_attempts_col.update_one({'email': email}, update)

        saved = user_attempts_col.find_one({'email': email}, {'_id': 0})
        return jsonify({'status': 'success', 'data': saved}), 201
    except Exception as e:
        logger.error(f"Error saving quiz attempt: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/quiz/attempts', methods=['GET'])
def list_quiz_attempts():
    """
    Returns all attempts for the current logged-in user (from cookie). If not logged in,
    you may pass ?email=... to fetch by email (optional depending on privacy needs).
    """
    user = _current_user_from_cookie()
    email = None
    if user:
        email = user.get('email')
    else:
        email = (request.args.get('email') or '').strip().lower()
    if not email:
        return jsonify({'error': 'Not authenticated and no email provided'}), 401

    doc = user_attempts_col.find_one({'email': email}, {'_id': 0})
    if not doc:
        return jsonify({'status': 'success', 'data': {'name': user.get('name') if user else None, 'email': email, 'totalAttempts': 0, 'attempts': []}})
    return jsonify({'status': 'success', 'data': doc})

@app.route('/predict', methods=['POST'])
def predict():
    """Make learning style predictions"""
    if predictor is None:
        return jsonify({'error': 'Models not loaded'}), 500
    
    try:
        # Get input data from request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = [
            'Age', 'Age_Group', 'Gender', 'Education_Level', 'Preferred_Study_Time',
            'Learning_Goal', 'Language_Preference', 'Prefers_Diagrams', 'Likes_Listening',
            'Enjoys_Reading', 'HandsOn_Activities', 'Remembers_Pictures', 'Prefers_Lectures',
            'Writes_Notes', 'Builds_Models', 'Watches_Videos', 'Participates_Discussions',
            'Reads_Textbooks', 'Does_Experiments', 'Draws_Mindmaps', 
            'Listens_MusicWhileStudying', 'Moves_WhileLearning'
        ]
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                'error': 'Missing required fields',
                'missing_fields': missing_fields
            }), 400
        
        # Get model type from request (default to 'random_forest')
        model_type = data.get('model_type', 'random_forest')
        if model_type not in ['random_forest']:
            return jsonify({'error': 'Invalid model_type. Must be: random_forest'}), 400
        
        # Make predictions
        predictions = predictor.predict(data, model_type)
        
        # Get learning style descriptions
        results = {}
        for model_name, prediction_data in predictions.items():
            style = prediction_data['prediction']
            description = predictor.get_learning_style_description(style)
            
            results[model_name] = {
                'prediction': prediction_data['prediction'],
                'probabilities': prediction_data['probabilities'],
                'confidence': prediction_data['confidence'],
                'description': description
            }
        
        return jsonify({
            'status': 'success',
            'data': results,
            'input_data': data
        })
        
    except Exception as e:
        logger.error(f"Error making prediction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/predict/sample', methods=['GET'])
def sample_prediction():
    """Get a sample prediction with example data"""
    if predictor is None:
        return jsonify({'error': 'Models not loaded'}), 500
    
    # Sample input data
    sample_data = {
        'Age': 25,
        'Age_Group': 'Young Adult',
        'Gender': 'Male',
        'Education_Level': 'Undergraduate',
        'Preferred_Study_Time': 'Evening',
        'Learning_Goal': 'Career Growth',
        'Language_Preference': 'English',
        'Prefers_Diagrams': 4,
        'Likes_Listening': 3,
        'Enjoys_Reading': 2,
        'HandsOn_Activities': 5,
        'Remembers_Pictures': 3,
        'Prefers_Lectures': 2,
        'Writes_Notes': 4,
        'Builds_Models': 5,
        'Watches_Videos': 3,
        'Participates_Discussions': 2,
        'Reads_Textbooks': 1,
        'Does_Experiments': 5,
        'Draws_Mindmaps': 2,
        'Listens_MusicWhileStudying': 4,
        'Moves_WhileLearning': 5
    }
    
    try:
        predictions = predictor.predict(sample_data, 'random_forest')
        
        results = {}
        for model_name, prediction_data in predictions.items():
            style = prediction_data['prediction']
            description = predictor.get_learning_style_description(style)
            
            results[model_name] = {
                'prediction': prediction_data['prediction'],
                'probabilities': prediction_data['probabilities'],
                'confidence': prediction_data['confidence'],
                'description': description
            }
        
        return jsonify({
            'status': 'success',
            'data': results,
            'sample_input': sample_data,
            'note': 'This is a sample prediction. Use POST /predict with your own data for real predictions.'
        })
        
    except Exception as e:
        logger.error(f"Error making sample prediction: {e}")
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Check if models exist
    if not os.path.exists('models'):
        print("Models directory not found. Please run model_trainer.py first to train the models.")
        print("You can still start the server, but predictions will fail until models are trained.")
    
    # Run the Flask app
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 