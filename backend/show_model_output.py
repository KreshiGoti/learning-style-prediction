import requests
import json

def show_model_output():
    """Display ML model output in a clear format"""
    
    print("🎯 Learning Style Prediction ML Model Output")
    print("=" * 60)
    
    # Test 1: Health Check
    print("\n1️⃣ API Health Check:")
    print("-" * 30)
    try:
        response = requests.get("http://localhost:5000/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Status: {data['status']}")
            print(f"📊 Models Loaded: {data['models_loaded']}")
            print(f"💬 Message: {data['message']}")
        else:
            print(f"❌ Error: HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")
    
    # Test 2: Sample Prediction
    print("\n2️⃣ Sample ML Model Prediction:")
    print("-" * 30)
    try:
        response = requests.get("http://localhost:5000/predict/sample")
        if response.status_code == 200:
            data = response.json()
            
            for model_name, result in data['data'].items():
                print(f"\n🤖 {model_name.replace('_', ' ').title()} Model:")
                print(f"   🎯 Prediction: {result['prediction']}")
                print(f"   📊 Confidence: {result['confidence']:.1%}")
                
                # Show probabilities
                print("   📈 Probabilities:")
                for style, prob in result['probabilities'].items():
                    bar = "█" * int(prob * 20)  # Visual bar
                    print(f"     {style:12}: {prob:.1%} {bar}")
                
                # Show description
                desc = result['description']
                print(f"\n   📝 Description: {desc['description']}")
                
                print("   💡 Top Recommendations:")
                for i, rec in enumerate(desc['recommendations'][:3], 1):
                    print(f"     {i}. {rec}")
                
                print("-" * 50)
        else:
            print(f"❌ Error: HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 3: Custom Prediction
    print("\n3️⃣ Custom ML Model Prediction:")
    print("-" * 30)
    
    # Sample data for a visual learner
    custom_data = {
        'Age': 22,
        'Age_Group': 'Young Adult',
        'Gender': 'Female',
        'Education_Level': 'Undergraduate',
        'Preferred_Study_Time': 'Morning',
        'Learning_Goal': 'Exams',
        'Language_Preference': 'English',
        'Prefers_Diagrams': 5,  # High visual preference
        'Likes_Listening': 2,   # Low auditory preference
        'Enjoys_Reading': 4,    # High reading preference
        'HandsOn_Activities': 1, # Low hands-on preference
        'Remembers_Pictures': 5, # High visual memory
        'Prefers_Lectures': 3,   # Moderate lecture preference
        'Writes_Notes': 4,       # High note-taking preference
        'Builds_Models': 1,      # Low model building preference
        'Watches_Videos': 4,     # High video preference
        'Participates_Discussions': 2, # Low discussion preference
        'Reads_Textbooks': 5,    # High textbook preference
        'Does_Experiments': 1,   # Low experiment preference
        'Draws_Mindmaps': 5,     # High mind map preference
        'Listens_MusicWhileStudying': 3, # Moderate music preference
        'Moves_WhileLearning': 2, # Low movement preference
        'model_type': 'random_forest'
    }
    
    try:
        response = requests.post(
            "http://localhost:5000/predict",
            json=custom_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            data = response.json()
            
            for model_name, result in data['data'].items():
                print(f"\n🤖 {model_name.replace('_', ' ').title()} Model:")
                print(f"   🎯 Prediction: {result['prediction']}")
                print(f"   📊 Confidence: {result['confidence']:.1%}")
                
                # Show probabilities
                print("   📈 Probabilities:")
                for style, prob in result['probabilities'].items():
                    bar = "█" * int(prob * 20)  # Visual bar
                    print(f"     {style:12}: {prob:.1%} {bar}")
                
                # Show description
                desc = result['description']
                print(f"\n   📝 Description: {desc['description']}")
                
                print("   💡 Top Recommendations:")
                for i, rec in enumerate(desc['recommendations'][:3], 1):
                    print(f"     {i}. {rec}")
                
                print("-" * 50)
        else:
            print(f"❌ Error: HTTP {response.status_code}")
            print(f"   Error: {response.json()}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 4: Model Information
    print("\n4️⃣ ML Model Information:")
    print("-" * 30)
    try:
        response = requests.get("http://localhost:5000/model-info")
        if response.status_code == 200:
            data = response.json()
            info = data['data']
            
            print(f"🤖 Available Models: {', '.join(info['available_models'])}")
            print(f"🎯 Learning Styles: {', '.join(info['classes'])}")
            print(f"📝 Total Features: {len(info['feature_names'])}")
            print(f"🏷️  Categorical Features: {len(info['categorical_columns'])}")
            
            print("\n📋 Feature Names (first 10):")
            for i, feature in enumerate(info['feature_names'][:10], 1):
                print(f"   {i}. {feature}")
            if len(info['feature_names']) > 10:
                print(f"   ... and {len(info['feature_names']) - 10} more features")
        else:
            print(f"❌ Error: HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("🎉 ML Model Output Display Complete!")

if __name__ == "__main__":
    show_model_output() 