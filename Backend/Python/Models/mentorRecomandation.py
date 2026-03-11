import pandas as pd
import pickle
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer

script_dir = Path(__file__).resolve().parent
data_path = script_dir.parent / "datasets" / "mentor.csv"

# Read mentor data
df = pd.read_csv(data_path)

# Create TF-IDF vectorizer from skills column
texts = df["skills"].astype(str).tolist()
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

# Prepare model data including mentor profiles
model_data = {
    "vectorizer": vectorizer,
    "matrix": X,
    "mentors": df.to_dict(orient="records")
}

# Save the model
model_path = script_dir / "mentor_model.pkl"
with open(model_path, "wb") as f:
    pickle.dump(model_data, f)

print("Mentor model trained and saved ✅")
