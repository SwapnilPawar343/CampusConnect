import React, { useState } from "react";

const MentorRecommendation = () => {
  const [skills, setSkills] = useState("");
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [requestLoadingMentor, setRequestLoadingMentor] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

  const recommend = async () => {
    if (!skills.trim()) {
      alert("Please enter skills first.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/mentors/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to recommend mentors");
        return;
      }

      const results = Array.isArray(data.data) ? data.data : [];
      setMentors(results);
    } catch (error) {
      console.error("Mentor recommendation error:", error);
      alert("Failed to get mentor recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  

   
  const requestMentorship = async (mentorId, mentorName) => {
    try {
      setRequestLoadingMentor(mentorId);
      const token = localStorage.getItem("token");

      const response = await fetch(`${backendUrl}/api/mentor-requests/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          alumniId: mentorId,
          message: `I would like to request mentorship from ${mentorName}.`
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to send mentorship request");
        return;
      }

      alert("Mentorship request sent successfully! The mentor will review your request.");
    } catch (error) {
      console.error("Request mentorship error:", error);
      alert("Failed to send mentorship request. Please try again.");
    } finally {
      setRequestLoadingMentor("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 p-4 md:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-pink-300">
            👨‍🏫 Mentor Recommendation Engine
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Find experienced mentors who match your skills and goals
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-2xl shadow-lg p-6 md:p-8 mb-10 border border-pink-500/30 backdrop-blur-xl max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-1">✨ Your Skills</h2>
          <p className="text-purple-300 text-sm mb-4">Enter skills you want to learn or improve</p>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="React, Machine Learning, System Design..."
              className="w-full bg-slate-800/50 border-2 border-pink-500/30 px-4 py-3 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition text-white placeholder-purple-400 text-sm"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

            <button
              onClick={recommend}
              disabled={loading}
              className="w-full relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition duration-300 blur opacity-60 group-disabled:opacity-40"></div>
              <div className="relative bg-slate-900 rounded-xl px-6 py-3 group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-pink-600 transition duration-300">
                <span className="block font-bold text-white text-sm">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⚡</span> Finding Mentors...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">🔍 Recommend Mentors</span>
                  )}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mentor Cards */}
        {mentors.length > 0 && (
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-8">
              🌟 {mentors.length} Perfect Match{mentors.length !== 1 ? "es" : ""}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((m) => (
                <div 
                  key={m.userId} 
                  className="group bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-2xl border border-pink-500/30 hover:border-pink-400/60 p-6 shadow-lg backdrop-blur-xl transition duration-300 hover:shadow-xl hover:shadow-pink-500/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {m.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition">{m.username}</h3>
                      <p className="text-purple-300 text-sm font-medium">{m.jobRole}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-purple-300 text-xs font-semibold mb-1">SKILLS</p>
                      <p className="text-purple-200 text-sm">{m.skills}</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-purple-300 text-xs font-semibold">MATCH SCORE</p>
                        <span className="text-lg font-bold text-pink-400">{m.match_percent}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg shadow-pink-500/30"
                          style={{ width: `${m.match_percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => requestMentorship(m.userId, m.username)}
                      disabled={requestLoadingMentor === m.userId}
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg font-bold text-sm transition"
                    >
                      {requestLoadingMentor === m.userId ? "Requesting..." : "📧 Request Mentor"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && mentors.length === 0 && skills && (
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-3xl p-16 text-center border border-pink-500/30 backdrop-blur-xl">
            <p className="text-purple-300 text-lg">No mentors found matching those skills. Try different keywords!</p>
          </div>
        )}

        {/* Initial State */}
        {!loading && mentors.length === 0 && !skills && (
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-3xl p-16 text-center border border-pink-500/30 backdrop-blur-xl">
            <div className="text-7xl mb-6">🎯</div>
            <h3 className="text-3xl font-bold text-white mb-3">Ready to Find Your Mentor?</h3>
            <p className="text-purple-300 text-lg">Enter your skills above to discover mentors who can guide your journey</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorRecommendation;
