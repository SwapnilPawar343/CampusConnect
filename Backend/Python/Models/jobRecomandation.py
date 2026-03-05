import pandas as pd
import pickle
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer

script_dir = Path(__file__).resolve().parent
data_path = script_dir.parent / "datasets" / "jobs.csv"
df = pd.read_csv(data_path)
texts = df["skills_required"].astype(str).tolist()
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)
model_data = {
    "vectorizer": vectorizer,
    "matrix": X,
    "jobs": df.to_dict(orient="records")
}
with open("job_model.pkl", "wb") as f:
    pickle.dump(model_data, f)

print("Model saved ✅")