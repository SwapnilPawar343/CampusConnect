import json
import math
import pickle
import sys
from pathlib import Path
from sklearn.metrics.pairwise import cosine_similarity

model_path = Path(__file__).resolve().parent.parent / "Models" / "job_model.pkl"
with open(model_path, "rb") as f:
    data = pickle.load(f)

vectorizer = data["vectorizer"]
matrix = data["matrix"]
jobs = data["jobs"]

def _clean_value(value):
    if value is None:
        return ""
    if isinstance(value, float) and math.isnan(value):
        return ""
    return value


def predict(skills_list, top_k=4):
    text = " ".join(skills_list)
    user_vec = vectorizer.transform([text])

    scores = cosine_similarity(user_vec, matrix)[0]
    if scores.max() <= 0:
        return []

    top_indices = scores.argsort()[-top_k:][::-1]
    results = []
    for idx in top_indices:
        job = jobs[idx]
        results.append({
            "job_title": _clean_value(job.get("job_title")),
            "skills_required": _clean_value(job.get("skills_required")),
            "match_percent": round(float(scores[idx]) * 100, 2)
        })

    return results


if __name__ == "__main__":
    raw = " ".join(sys.argv[1:]).strip()
    if not raw:
        print(json.dumps({"error": "skills required"}))
        sys.exit(1)

    skills = [s.strip() for s in raw.split(",") if s.strip()]
    if not skills:
        print(json.dumps({"error": "skills required"}))
        sys.exit(1)

    results = predict(skills)
    print(json.dumps({"results": results}))