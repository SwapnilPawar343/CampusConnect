"""
Utility to add new alumni job entries to jobs.csv and retrain the job recommendation model.
Called from Node.js backend when a new alumni registers.
"""

import json
import sys
from pathlib import Path

import pandas as pd

script_dir = Path(__file__).resolve().parent.parent
if str(script_dir) not in sys.path:
    sys.path.append(str(script_dir))

from Models.jobRecomandation import train_job_model


data_path = script_dir / "datasets" / "jobs.csv"


def read_jobs_csv(path):
    # Some environments contain an Excel workbook saved with .csv extension.
    with open(path, "rb") as file_obj:
        signature = file_obj.read(2)

    if signature == b"PK":
        return pd.read_excel(path)

    encodings = ["utf-8", "utf-8-sig", "cp1252", "latin1"]
    last_error = None

    for encoding in encodings:
        try:
            return pd.read_csv(path, encoding=encoding)
        except UnicodeDecodeError as error:
            last_error = error

    if last_error:
        raise last_error

    return pd.read_csv(path)


def normalize_skills(skills_text):
    parts = [part.strip().lower() for part in str(skills_text).split(",") if part.strip()]
    return ", ".join(sorted(dict.fromkeys(parts)))


def infer_industry(job_title, existing_df):
    title = str(job_title).strip().lower()

    existing_matches = existing_df[existing_df["job_title"].astype(str).str.strip().str.lower() == title]
    if not existing_matches.empty:
        industry = existing_matches.iloc[0].get("industry")
        if pd.notna(industry) and str(industry).strip():
            return str(industry).strip()

    industry_map = {
        "quantum": "Quantum Computing",
        "blockchain": "Blockchain",
        "contract": "Blockchain",
        "ai": "AI",
        "machine learning": "AI",
        "ml": "AI",
        "data": "AI",
        "renewable": "Green Tech",
        "energy": "Green Tech",
        "sustainability": "Green Tech",
    }

    for keyword, industry in industry_map.items():
        if keyword in title:
            return industry

    return "General"


def add_job_and_retrain(job_title, skills, alumni_id=None):
    try:
        df = read_jobs_csv(data_path)
        df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

        required_columns = ["job_id", "job_title", "industry", "skills_required"]
        for column in required_columns:
            if column not in df.columns:
                df[column] = ""

        df = df[required_columns].copy()
        df["job_id"] = pd.to_numeric(df["job_id"], errors="coerce")
        normalized_skills = normalize_skills(skills)
        normalized_title = str(job_title).strip().lower()

        existing_rows = df[
            df["job_title"].astype(str).str.strip().str.lower().eq(normalized_title)
            & df["skills_required"].astype(str).apply(normalize_skills).eq(normalized_skills)
        ]

        added = False
        if existing_rows.empty:
            next_job_id = int(df["job_id"].max()) + 1 if df["job_id"].notna().any() else 1
            new_row = {
                "job_id": next_job_id,
                "job_title": str(job_title).strip(),
                "industry": infer_industry(job_title, df),
                "skills_required": ", ".join([skill.strip() for skill in str(skills).split(",") if skill.strip()]),
            }
            df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
            added = True

        df.to_csv(data_path, index=False)
        train_job_model()

        if added:
            message = "Job entry added successfully and job model retrained"
        else:
            message = "Job entry already exists; job model retrained"

        return {
            "success": True,
            "message": message,
            "added": added,
            "alumniId": alumni_id,
        }
    except Exception as e:
        return {
            "success": False,
            "message": str(e),
        }


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print(json.dumps({
            "success": False,
            "message": "Usage: python jobModelUpdate.py <alumni_id> <job_title> <skills>"
        }))
        sys.exit(1)

    alumni_id = sys.argv[1]
    job_title = sys.argv[2]
    skills = sys.argv[3]

    result = add_job_and_retrain(job_title, skills, alumni_id)
    print(json.dumps(result))