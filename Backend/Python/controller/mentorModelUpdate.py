"""
Utility to add new alumni to mentor database and retrain the mentor model
Called from Node.js backend when new alumni registers
"""

import pandas as pd
import pickle
import sys
import json
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer

script_dir = Path(__file__).resolve().parent.parent

def add_alumni_and_retrain(user_id, username, skills, job_role):
    """
    Add new alumni to mentor.csv and retrain the mentor recommendation model
    
    Args:
        user_id: Alumni user ID
        username: Alumni username
        skills: Space-separated skills string
        job_role: Alumni job role
    
    Returns:
        dict with success status and message
    """
    try:
        data_path = script_dir / "datasets" / "mentor.csv"
        
        # Read existing mentor data
        df = pd.read_csv(data_path)
        
        # Create new mentor record
        new_mentor = {
            "userId": user_id,
            "username": username,
            "skills": skills,
            "jobRole": job_role
        }
        
        # Add to dataframe
        new_row = pd.DataFrame([new_mentor])
        df = pd.concat([df, new_row], ignore_index=True)
        
        # Save updated CSV
        df.to_csv(data_path, index=False)
        
        # Retrain the model
        texts = df["skills"].astype(str).tolist()
        vectorizer = TfidfVectorizer()
        X = vectorizer.fit_transform(texts)
        
        # Prepare model data
        model_data = {
            "vectorizer": vectorizer,
            "matrix": X,
            "mentors": df.to_dict(orient="records")
        }
        
        # Save updated model
        model_path = script_dir / "Models" / "mentor_model.pkl"
        with open(model_path, "wb") as f:
            pickle.dump(model_data, f)
        
        return {
            "success": True,
            "message": f"Alumni {username} added successfully and mentor model retrained"
        }
    
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }


if __name__ == "__main__":
    if len(sys.argv) < 5:
        print(json.dumps({
            "success": False,
            "message": "Usage: python mentorModelUpdate.py <user_id> <username> <skills> <job_role>"
        }))
        sys.exit(1)
    
    user_id = sys.argv[1]
    username = sys.argv[2]
    skills = sys.argv[3]
    job_role = sys.argv[4]
    
    result = add_alumni_and_retrain(user_id, username, skills, job_role)
    print(json.dumps(result))
