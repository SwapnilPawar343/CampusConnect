from flask import Flask, jsonify, request
from controller.predictsJob import predict

app = Flask(__name__)

@app.route('/')
def home():
    return "Welcome to Campus Connect Backend!"


@app.route('/api/job-recommendation', methods=['POST'])
def job_recommendation():
    payload = request.get_json(silent=True) or {}
    skills = payload.get("skills")
    if isinstance(skills, str):
        skills = [s.strip() for s in skills.split(",") if s.strip()]
    if not skills or not isinstance(skills, list):
        return jsonify({"message": "skills must be a non-empty list or comma-separated string"}), 400

    job = predict(skills)
    return jsonify({"job": job})

if __name__ == "__main__":
    app.run(debug=True)