import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import os

def train_and_save_models():
    """
    Train both Random Forest and Logistic Regression models and save them
    along with the preprocessor for deployment
    """
    
    # Resolve paths relative to this file so script works from any CWD
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, "learning_styles_dataset.csv")
    models_dir = os.path.join(base_dir, 'models')

    # Load dataset
    print("Loading dataset...")
    df = pd.read_csv(data_path)
    
    # Features (drop target)
    X = df.drop(columns=["Style"])
    
    # One-hot encode categorical demographics
    categorical_columns = ["Gender", "Education_Level", "Preferred_Study_Time",
                          "Learning_Goal", "Language_Preference", "Age_Group"]
    
    X = pd.get_dummies(X, columns=categorical_columns, drop_first=True)
    
    # Target
    y = df["Style"]
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale numeric VARK features
    vark_columns = ["Prefers_Diagrams", "Likes_Listening", "Enjoys_Reading", "HandsOn_Activities",
                    "Remembers_Pictures", "Prefers_Lectures", "Writes_Notes", "Builds_Models",
                    "Watches_Videos", "Participates_Discussions", "Reads_Textbooks", "Does_Experiments",
                    "Draws_Mindmaps", "Listens_MusicWhileStudying", "Moves_WhileLearning"]
    
    scaler = StandardScaler()
    X_train[vark_columns] = scaler.fit_transform(X_train[vark_columns])
    X_test[vark_columns] = scaler.transform(X_test[vark_columns])
    
    # Create models directory if it doesn't exist
    os.makedirs(models_dir, exist_ok=True)
    
    # Save the scaler and feature names for preprocessing new data
    joblib.dump(scaler, os.path.join(models_dir, 'scaler.pkl'))
    joblib.dump(X.columns.tolist(), os.path.join(models_dir, 'feature_names.pkl'))
    joblib.dump(categorical_columns, os.path.join(models_dir, 'categorical_columns.pkl'))
    
    print("Training Random Forest model...")
    # Initialize and train Random Forest Classifier
    rf_model = RandomForestClassifier(n_estimators=200, random_state=42)
    rf_model.fit(X_train, y_train)
    
    # Evaluate Random Forest
    y_pred_rf = rf_model.predict(X_test)
    rf_accuracy = accuracy_score(y_test, y_pred_rf)
    print(f"Random Forest Accuracy: {rf_accuracy:.4f}")
    
    # Save model
    joblib.dump(rf_model, os.path.join(models_dir, 'random_forest_model.pkl'))
    
    print("Model saved successfully!")
    print(f"Random Forest model saved with accuracy: {rf_accuracy:.4f}")
    
    return {
        'random_forest_accuracy': rf_accuracy,
        'feature_names': X.columns.tolist(),
        'categorical_columns': categorical_columns,
        'vark_columns': vark_columns
    }

if __name__ == "__main__":
    train_and_save_models() 