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
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 p-4 md:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-magenta-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-pink-300">
            🚀 Career Prediction Engine
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Unlock your potential and discover careers that match your unique skill set
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-2xl shadow-2xl p-6 md:p-8 mb-8 border border-pink-500/20 backdrop-blur-xl max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-1">✨ Your Skills</h2>
          <p className="text-purple-300 text-sm mb-4">List your technical and professional skills</p>

          <div className="space-y-3">
            <textarea
              placeholder="Python, JavaScript, React, Node.js, Machine Learning..."
              rows="3"
              className="w-full bg-slate-800/50 border-2 border-pink-500/30 px-4 py-3 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition duration-300 resize-none text-white placeholder-purple-400 text-sm"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

            <button
              onClick={predict}
              disabled={loading}
              className="w-full relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition duration-300 blur group-disabled:opacity-50"></div>
              <div className="relative bg-slate-900 rounded-xl px-6 py-3 group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-pink-600 transition duration-300">
                <span className="block font-bold text-white text-sm">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⚡</span> Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 group-hover:scale-105 transition">
                      🔮 Predict
                    </span>
                  )}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Results Section */}
        {Array.isArray(prediction) && prediction.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white">🎯 Perfect Matches</h2>
                <p className="text-purple-300 mt-2">Based on your skills analysis</p>
              </div>
              <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl px-6 py-3">
                <p className="font-bold text-white text-lg">{prediction.length} roles</p>
              </div>
            </div>

            <div className="space-y-4">
              {prediction.map((item, index) => (
                <div
                  key={`${item.job_title}-${index}`}
                  className="group bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-2xl p-6 md:p-8 border border-pink-500/30 hover:border-pink-400/60 transition duration-300 backdrop-blur-xl hover:shadow-2xl hover:shadow-pink-500/20"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-400 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                          <div className="relative w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                            {index + 1}
                          </div>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-300 group-hover:from-purple-300 group-hover:to-pink-300 transition">
                          {item.job_title}
                        </h3>
                      </div>

                      <div className="space-y-4 mt-4">
                        <div>
                          <p className="text-purple-300 text-sm font-semibold mb-2">REQUIRED SKILLS</p>
                          <div className="flex flex-wrap gap-2">
                            {item.skills_required.split(',').map((skill, idx) => (
                              <span
                                key={idx}
                                className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/50 text-pink-200 px-3 py-1 rounded-lg text-sm hover:from-pink-500/40 hover:to-purple-500/40 transition"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-purple-300 font-semibold text-sm">MATCH PERCENTAGE</p>
                            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                              {item.match_percent}%
                            </span>
                          </div>
                          <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 shadow-lg shadow-pink-500/50 transition-all duration-500"
                              style={{ width: `${item.match_percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setAsCareer(item)}
                      disabled={saveLoadingJob === item.job_title}
                      className="lg:flex-shrink-0 w-full lg:w-auto relative overflow-hidden group/btn"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl group-hover/btn:scale-110 transition duration-300 blur group-disabled/btn:opacity-50"></div>
                      <div className="relative bg-slate-900 rounded-2xl px-8 py-4 group-hover/btn:bg-gradient-to-r group-hover/btn:from-green-500 group-hover/btn:to-emerald-500 transition duration-300">
                        <span className="block font-bold text-white text-center">
                          {saveLoadingJob === item.job_title ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="animate-spin">⚙️</span> Saving...
                            </span>
                          ) : (
                            <span>💾 Save Goal</span>
                          )}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !prediction && (
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-3xl shadow-2xl p-16 text-center border border-pink-500/30 backdrop-blur-xl">
            <div className="text-7xl mb-6 animate-bounce">🎯</div>
            <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-300 mb-3">
              Ready to Discover Your Path?
            </h3>
            <p className="text-xl text-purple-300 max-w-2xl mx-auto">
              Enter your skills above and let our AI-powered engine find your perfect career matches
            </p>
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="mt-10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-3xl shadow-2xl p-8 md:p-10 border border-pink-500/30 backdrop-blur-xl">
            <h3 className="text-3xl font-bold text-white mb-8">📜 Recent Predictions</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {history.map((h, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-pink-400/30 rounded-2xl p-5 hover:border-pink-400/60 hover:from-purple-900/50 hover:to-pink-900/50 transition duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0 group-hover:scale-110 transition">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-lg truncate group-hover:text-pink-300 transition">
                        {h.job}
                      </p>
                      <p className="text-purple-400 text-sm truncate">Skills: {h.skills.substring(0, 40)}...</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerPrediction;
