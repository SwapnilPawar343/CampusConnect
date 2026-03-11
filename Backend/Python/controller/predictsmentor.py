import json
import math
import pickle
import sys
from pathlib import Path
from sklearn.metrics.pairwise import cosine_similarity

model_path = Path(__file__).resolve().parent.parent / "Models" / "mentor_model.pkl"
with open(model_path, "rb") as f:
    data = pickle.load(f)

vectorizer = data["vectorizer"]
matrix = data["matrix"]
mentors = data["mentors"]

def _clean_value(value):
    if value is None:
        return ""
    if isinstance(value, float) and math.isnan(value):
        return ""
    return value


def predict(skills_list, top_k=5):
    """
    Find top K mentors matching the given skills
    
    Args:
        skills_list: List of skills (e.g., ["Python", "Django", "REST API"])
        top_k: Number of mentors to return (default 5)
    
    Returns:
        List of mentor profiles with match percentage
    """
    text = " ".join(skills_list)
    user_vec = vectorizer.transform([text])

    scores = cosine_similarity(user_vec, matrix)[0]
    if scores.max() <= 0:
        return []

    top_indices = scores.argsort()[-top_k:][::-1]
    results = []
    for idx in top_indices:
        mentor = mentors[idx]
        results.append({
            "userId": int(_clean_value(mentor.get("userId", ""))),
            "username": _clean_value(mentor.get("username")),
            "skills": _clean_value(mentor.get("skills")),
            "jobRole": _clean_value(mentor.get("jobRole")),
            "match_percent": round(float(scores[idx]) * 100, 2)
        })

    return results


if __name__ == "__main__":
    raw = " ".join(sys.argv[1:]).strip()
    if not raw:
        print(json.dumps({"error": "skills required"}))
        sys.exit(1)

    result = predict(raw.split())
    print(json.dumps(result))
