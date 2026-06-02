import pandas as pd
import pickle
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer

script_dir = Path(__file__).resolve().parent
data_path = script_dir.parent / "datasets" / "jobs.csv"
model_path = script_dir / "job_model.pkl"


def train_job_model():
    df = pd.read_excel(data_path, engine="openpyxl")
    df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

    required_columns = ["job_id", "job_title", "industry", "skills_required"]
    available_columns = [column for column in required_columns if column in df.columns]
    df = df[available_columns].copy()

    texts = df["skills_required"].astype(str).fillna("").tolist()
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(texts)

    model_data = {
        "vectorizer": vectorizer,
        "matrix": X,
        "jobs": df.to_dict(orient="records")
    }

    with open(model_path, "wb") as f:
        pickle.dump(model_data, f)

    return model_data


if __name__ == "__main__":
    train_job_model()
    print("Model saved ✅")