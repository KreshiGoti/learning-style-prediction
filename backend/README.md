# Learning Style Prediction Backend

A Python Flask backend that provides learning style predictions using machine learning models. The API classifies students into four learning styles: Auditory, Visual, Kinesthetic, and Read/Write.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Train Models (First Time Only)
```bash
python model_trainer.py
```

### 3. Start the API Server
```bash
python app.py
```

### 4. Test the Backend
```bash
python test_backend.py
```

## 📁 Project Structure

```
SGP3/
├── learning_styles_dataset.csv          # Your training dataset
├── Random_Forest_m1(sgp).ipynb         # Your trained model notebook
├── model_trainer.py                     # Script to train and save models
├── model_predictor.py                   # Prediction class
├── app.py                              # Flask API server
├── test_backend.py                     # Backend testing script
├── requirements.txt                    # Python dependencies
└── README.md                          # This file
```

## 🔧 Setup Instructions

### Step 1: Install Dependencies
```bash
pip install flask flask-cors pandas scikit-learn numpy joblib requests python-dotenv
```

### Step 2: Train and Save Models
The `model_trainer.py` script will:
- Load your dataset from `learning_styles_dataset.csv`
- Train both Random Forest and Logistic Regression models
- Save models and preprocessors to `models/` directory
- Display accuracy scores

```bash
python model_trainer.py
```

### Step 3: Start the API Server
```bash
python app.py
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### 1. Home (`GET /`)
Returns API information and available endpoints.

### 2. Health Check (`GET /health`)
Check if the API is running and models are loaded.

### 3. Model Information (`GET /model-info`)
Get information about the trained models and available features.

### 4. Sample Prediction (`GET /predict/sample`)
Get a sample prediction using example data.

### 5. Make Prediction (`POST /predict`)
Make learning style predictions with custom data.

#### Request Body Example:
```json
{
  "Age": 25,
  "Age_Group": "Young Adult",
  "Gender": "Male",
  "Education_Level": "Undergraduate",
  "Preferred_Study_Time": "Evening",
  "Learning_Goal": "Career Growth",
  "Language_Preference": "English",
  "Prefers_Diagrams": 4,
  "Likes_Listening": 3,
  "Enjoys_Reading": 2,
  "HandsOn_Activities": 5,
  "Remembers_Pictures": 3,
  "Prefers_Lectures": 2,
  "Writes_Notes": 4,
  "Builds_Models": 5,
  "Watches_Videos": 3,
  "Participates_Discussions": 2,
  "Reads_Textbooks": 1,
  "Does_Experiments": 5,
  "Draws_Mindmaps": 2,
  "Listens_MusicWhileStudying": 4,
  "Moves_WhileLearning": 5,
  "model_type": "both"
}
```

#### Response Example:
```json
{
  "status": "success",
  "data": {
    "random_forest": {
      "prediction": "Kinesthetic",
      "probabilities": {
        "Auditory": 0.05,
        "Kinesthetic": 0.85,
        "Read/Write": 0.08,
        "Visual": 0.02
      },
      "confidence": 0.85,
      "description": {
        "description": "You learn best through hands-on experience...",
        "characteristics": [...],
        "recommendations": [...]
      }
    },
    "logistic_regression": {
      "prediction": "Kinesthetic",
      "probabilities": {...},
      "confidence": 0.82,
      "description": {...}
    }
  }
}
```

## 🧪 Testing

### Test the Backend
```bash
python test_backend.py
```

### Manual Testing with curl
```bash
# Health check
curl http://localhost:5000/health

# Sample prediction
curl http://localhost:5000/predict/sample

# Custom prediction
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"Age": 25, "Age_Group": "Young Adult", ...}'
```

## 🔗 Frontend Integration

### JavaScript Example
```javascript
// Make a prediction
const response = await fetch('http://localhost:5000/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(userData)
});

const result = await response.json();
console.log(result.data.random_forest.prediction);
```

### Python Example
```python
import requests

response = requests.post('http://localhost:5000/predict', 
                        json=user_data)
result = response.json()
print(result['data']['random_forest']['prediction'])
```

## 📊 Model Performance

Based on your training data:
- **Random Forest**: ~98.3% accuracy
- **Logistic Regression**: ~95.6% accuracy

## 🎯 Learning Styles

### Auditory
- Learn best through listening and speaking
- Prefer verbal instructions and discussions
- Remember information better when spoken

### Visual
- Learn best through visual aids and spatial understanding
- Prefer diagrams, charts, and written information
- Remember information better when written down

### Kinesthetic
- Learn best through hands-on experience and physical activity
- Prefer to learn by doing
- Remember information better when physically involved

### Read/Write
- Learn best through reading and writing
- Prefer text-based information and note-taking
- Remember information better when written down

## 🚀 Deployment

### Local Development
```bash
python app.py
```

### Production (using Gunicorn)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🔍 Troubleshooting

### Models Not Loading
If you get "Models not loaded" error:
1. Run `python model_trainer.py` first
2. Check that `models/` directory exists with saved files

### Port Already in Use
If port 5000 is busy:
```bash
# Change port in app.py or set environment variable
export PORT=5001
python app.py
```

### Missing Dependencies
```bash
pip install -r requirements.txt
```

## 📝 API Documentation

### Required Fields for Prediction
All predictions require these fields:
- `Age` (integer)
- `Age_Group` (string: Child/Teen/Young Adult/Adult 30+)
- `Gender` (string: Male/Female/Other)
- `Education_Level` (string: Primary School/High School/Undergraduate/Postgraduate/PhD)
- `Preferred_Study_Time` (string: Morning/Afternoon/Evening/Night)
- `Learning_Goal` (string: Exams/Skill Development/Career Growth/Hobby)
- `Language_Preference` (string: English/Hindi/Gujarati/Other)
- All VARK preference fields (1-5 scale)

### Model Types
- `random_forest`: Use only Random Forest model
- `logistic_regression`: Use only Logistic Regression model
- `both`: Use both models (default)

## 🎉 Success!

Your learning style prediction backend is now ready to serve predictions! The API will provide detailed learning style classifications with confidence scores and personalized recommendations. 