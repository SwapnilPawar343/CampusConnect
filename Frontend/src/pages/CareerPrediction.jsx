import React, { useState } from "react";
const CareerPrediction = () => {
  const [skills, setSkills] = useState("");
  const [prediction, setPrediction] = useState("");
  const [history, setHistory] = useState([]);

  const predict = () => {
    const job = "Software Engineer";
    setPrediction(job);
    setHistory([{ skills, job }, ...history]);
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
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Predict Career
        </button>
      </div>

      {prediction && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold">Predicted Job Role</h2>
          <p className="text-indigo-600 text-lg mt-2">{prediction}</p>
          <button className="mt-3 text-green-600 font-medium">
            View Recommended Mentor →
          </button>
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
