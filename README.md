# Learning Style Prediction System

A full-stack web application that predicts a student's preferred learning style using a **Random Forest Machine Learning model**. The project combines a **React.js** frontend with a **Flask** backend to provide real-time learning style predictions based on user responses.

## Features

* Predicts student learning styles using Machine Learning.
* Random Forest Classifier trained on a learning styles dataset.
* Interactive React.js user interface.
* Flask REST API for model prediction.
* Fast and accurate prediction results.
* Clean separation of frontend and backend.
* Easy to extend with additional machine learning models.

## Tech Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript

### Backend

* Python
* Flask

### Machine Learning

* Scikit-learn
* Random Forest
* Pandas
* NumPy

## Project Structure

```
SGP3/
│
├── backend/
│   ├── app/
│   ├── models/
│   ├── app.py
│   ├── model_trainer.py
│   ├── model_predictor.py
│   ├── learning_styles_dataset.csv
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

## Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/learning-style-prediction-system.git
```

### Backend Setup

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate

pip install -r requirements.txt

python app.py
```

### Frontend Setup

```bash
cd frontend

npm install

npm start
```

## Running the Backend

```bash
pip install -r backend/requirements.txt
python backend/app.py
```

## Running the Frontend

```bash
cd frontend
npm install
npm start
```

## Workflow

1. User answers the learning style questionnaire.
2. React sends the responses to the Flask backend.
3. Flask processes the input and passes it to the trained Random Forest model.
4. The model predicts the learning style.
5. The prediction is displayed to the user.

## Future Improvements

* User Authentication
* Database Integration
* Performance Dashboard
* Personalized Learning Recommendations
* Support for Multiple Machine Learning Algorithms

## Author

**Kreshi Goti**

B.Tech in Computer Science & Engineering
