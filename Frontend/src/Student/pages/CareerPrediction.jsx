import React, { useState } from "react";
const CareerPrediction = () => {
  const [skills, setSkills] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoadingJob, setSaveLoadingJob] = useState("");

  const predict = async () => {
    if (!skills.trim()) {
      alert("Please enter skills first.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/students/job-recommendation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to predict career");
        return;
      }

      const results = Array.isArray(data.results) ? data.results : [];
      setPrediction(results);

      if (results.length > 0) {
        setHistory([{ skills, job: results[0].job_title }, ...history]);
      }
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Failed to predict career. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setAsCareer = async (item) => {
    const storedStudent = JSON.parse(localStorage.getItem("student") || "null");
    if (!storedStudent?._id) {
      alert("Student session not found. Please login again.");
      return;
    }

    setSaveLoadingJob(item.job_title);
    try {
      const response = await fetch("http://localhost:4000/api/students/job-recommended", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          studentId: storedStudent._id,
          job_title: item.job_title,
          match_percent: item.match_percent,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to save career");
        return;
      }

      localStorage.setItem("student", JSON.stringify(data.student));
      alert("Career saved successfully. You can check it on the dashboard.");
    } catch (error) {
      console.error("Set career error:", error);
      alert("Failed to save career. Please try again.");
    } finally {
      setSaveLoadingJob("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Career Prediction</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <textarea
          placeholder="Enter your skills"
          rows="4"
          className="w-full border px-4 py-2 rounded-lg mb-4"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <button
          onClick={predict}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          {loading ? "Predicting..." : "Predict Career"}
        </button>
      </div>

      {Array.isArray(prediction) && prediction.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Predicted Job Roles</h2>
          <div className="space-y-3">
            {prediction.map((item, index) => (
              <div
                key={`${item.job_title}-${index}`}
                className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="text-indigo-700 font-semibold text-lg">{item.job_title}</p>
                  <p className="text-sm text-gray-600">Skills: {item.skills_required}</p>
                  <p className="text-sm text-gray-700 font-medium">Match: {item.match_percent}%</p>
                </div>
                <button
                  onClick={() => setAsCareer(item)}
                  disabled={saveLoadingJob === item.job_title}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-70"
                >
                  {saveLoadingJob === item.job_title ? "Saving..." : "Set as Career"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prediction History */}
      {history.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Prediction History</h3>
          {history.map((h, i) => (
            <p key={i} className="text-sm text-gray-600">
              {h.skills} → {h.job}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerPrediction;
