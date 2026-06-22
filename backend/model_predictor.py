import pandas as pd
import numpy as np
import joblib
import os
from typing import Dict, List, Tuple, Optional

class LearningStylePredictor:
    """
    A class to handle learning style predictions using trained models
    """
    
    def __init__(self, models_dir: str = None):
        """
        Initialize the predictor with trained models
        
        Args:
            models_dir: Directory containing the trained models
        """
        # Resolve models directory relative to this file so it works from any CWD
        if models_dir is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            self.models_dir = os.path.join(base_dir, 'models')
        else:
            self.models_dir = models_dir
        
        self.scaler = None
        self.feature_names = None
        self.categorical_columns = None
        self.rf_model = None
        
        self._load_models()
    
    def _load_models(self):
        """Load all trained models and preprocessors"""
        try:
            self.scaler = joblib.load(os.path.join(self.models_dir, 'scaler.pkl'))
            self.feature_names = joblib.load(os.path.join(self.models_dir, 'feature_names.pkl'))
            self.categorical_columns = joblib.load(os.path.join(self.models_dir, 'categorical_columns.pkl'))
            self.rf_model = joblib.load(os.path.join(self.models_dir, 'random_forest_model.pkl'))
            print("All models loaded successfully!")
        except FileNotFoundError as e:
            print(f"Error loading models: {e}")
            print("Please run model_trainer.py first to train and save the models.")
            raise
    
    def preprocess_input(self, input_data: Dict) -> pd.DataFrame:
        """
        Preprocess input data to match the training format
        
        Args:
            input_data: Dictionary containing user input data
            
        Returns:
            Preprocessed DataFrame ready for prediction
        """
        # Create a DataFrame with the input data
        df = pd.DataFrame([input_data])
        
        # One-hot encode categorical variables
        df_encoded = pd.get_dummies(df, columns=self.categorical_columns, drop_first=True)
        
        # Ensure all expected features are present
        for feature in self.feature_names:
            if feature not in df_encoded.columns:
                df_encoded[feature] = 0
        
        # Reorder columns to match training data
        df_encoded = df_encoded[self.feature_names]
        
        # Scale VARK features
        vark_columns = ["Prefers_Diagrams", "Likes_Listening", "Enjoys_Reading", "HandsOn_Activities",
                       "Remembers_Pictures", "Prefers_Lectures", "Writes_Notes", "Builds_Models",
                       "Watches_Videos", "Participates_Discussions", "Reads_Textbooks", "Does_Experiments",
                       "Draws_Mindmaps", "Listens_MusicWhileStudying", "Moves_WhileLearning"]
        
        df_encoded[vark_columns] = self.scaler.transform(df_encoded[vark_columns])
        
        return df_encoded
    
    def predict(self, input_data: Dict, model_type: str = 'random_forest') -> Dict:
        """
        Make predictions using the specified model
        
        Args:
            input_data: Dictionary containing user input data
            model_type: 'random_forest'
            
        Returns:
            Dictionary containing predictions and probabilities
        """
        # Preprocess input
        processed_data = self.preprocess_input(input_data)
        
        results = {}
        
        if model_type == 'random_forest':
            rf_prediction = self.rf_model.predict(processed_data)[0]
            rf_probabilities = self.rf_model.predict_proba(processed_data)[0]
            rf_confidence = max(rf_probabilities)
            
            results['random_forest'] = {
                'prediction': rf_prediction,
                'probabilities': dict(zip(self.rf_model.classes_, rf_probabilities)),
                'confidence': rf_confidence
            }
        

        
        return results
    
    def get_learning_style_description(self, style: str) -> Dict:
        """
        Get description and recommendations for a learning style
        
        Args:
            style: Learning style ('Auditory', 'Visual', 'Kinesthetic', 'Read/Write')
            
        Returns:
            Dictionary with description and recommendations
        """
        descriptions = {
            'Auditory': {
                'description': 'You learn best through listening and speaking. You prefer verbal instructions and discussions.',
                'characteristics': [
                    'Enjoys listening to lectures and discussions',
                    'Remembers information better when spoken',
                    'Prefers group discussions and verbal explanations',
                    'Likes to read aloud or talk through problems'
                ],
                'recommendations': [
                    'Participate in group discussions and study groups',
                    'Record lectures and listen to them later',
                    'Read aloud or explain concepts to others',
                    'Use verbal mnemonics and rhymes',
                    'Listen to educational podcasts and audiobooks'
                ]
            },
            'Visual': {
                'description': 'You learn best through visual aids and spatial understanding. You prefer diagrams, charts, and written information.',
                'characteristics': [
                    'Enjoys diagrams, charts, and visual presentations',
                    'Remembers information better when written down',
                    'Prefers to see information rather than hear it',
                    'Likes to use colors and spatial organization'
                ],
                'recommendations': [
                    'Use mind maps and diagrams to organize information',
                    'Create visual summaries with colors and symbols',
                    'Watch educational videos and documentaries',
                    'Use flashcards with images and diagrams',
                    'Draw pictures to represent concepts'
                ]
            },
            'Kinesthetic': {
                'description': 'You learn best through hands-on experience and physical activity. You prefer to learn by doing.',
                'characteristics': [
                    'Enjoys hands-on activities and experiments',
                    'Remembers information better when physically involved',
                    'Prefers to learn through movement and touch',
                    'Likes to build models and use physical objects'
                ],
                'recommendations': [
                    'Use hands-on activities and experiments',
                    'Take frequent breaks and move around while studying',
                    'Use physical objects to represent concepts',
                    'Practice skills through real-world applications',
                    'Use role-playing and simulations'
                ]
            },
            'Read/Write': {
                'description': 'You learn best through reading and writing. You prefer text-based information and note-taking.',
                'characteristics': [
                    'Enjoys reading textbooks and written materials',
                    'Remembers information better when written down',
                    'Prefers to take detailed notes',
                    'Likes to write summaries and essays'
                ],
                'recommendations': [
                    'Take detailed notes during lectures and readings',
                    'Write summaries of what you learn',
                    'Create lists and written outlines',
                    'Use written flashcards and study guides',
                    'Practice writing essays and explanations'
                ]
            }
        }
        
        return descriptions.get(style, {
            'description': 'Learning style not found',
            'characteristics': [],
            'recommendations': []
        })
    
    def get_model_info(self) -> Dict:
        """
        Get information about the trained models
        
        Returns:
            Dictionary with model information
        """
        return {
            'available_models': ['random_forest'],
            'feature_names': self.feature_names,
            'categorical_columns': self.categorical_columns,
            'classes': self.rf_model.classes_.tolist() if self.rf_model else []
        } 