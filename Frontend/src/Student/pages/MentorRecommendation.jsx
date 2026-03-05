import React, { useState } from "react";

const MentorRecommendation = () => {
  const [skills, setSkills] = useState("");
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoadingMentor, setSaveLoadingMentor] = useState("");

  const recommend = async () => {
    if (!skills.trim()) {
      alert("Please enter skills first.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/mentors/recommend", {
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

  const setAsMentor = async (mentor) => {
    const storedStudent = JSON.parse(localStorage.getItem("student") || "null");
    if (!storedStudent?._id) {
      alert("Student session not found. Please login again.");
      return;
    }

    setSaveLoadingMentor(mentor.userId);
    try {
      const response = await fetch("http://localhost:4000/api/students/save-mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          studentId: storedStudent._id,
          mentorName: mentor.username,
          mentorRole: mentor.jobRole,
          mentorId: mentor.userId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to save mentor");
        return;
      }

      localStorage.setItem("student", JSON.stringify(data.student));
      alert("Mentor saved successfully. You can see it on the dashboard.");
    } catch (error) {
      console.error("Set mentor error:", error);
      alert("Failed to save mentor. Please try again.");
    } finally {
      setSaveLoadingMentor("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Mentor Recommendation</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <input
          type="text"
          placeholder="Enter your skills (React, ML, DSA)"
          className="w-full border px-4 py-2 rounded-lg mb-4"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <button
          onClick={recommend}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-70"
        >
          {loading ? "Recommending..." : "Recommend Mentors"}
        </button>
      </div>

      {/* Mentor Cards */}
      {mentors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((m) => (
            <div key={m.userId} className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-indigo-700">{m.username}</h3>
              <p className="text-gray-600 font-medium">{m.jobRole}</p>
              <p className="text-sm text-gray-500 mt-2">Skills: {m.skills}</p>
              <p className="text-sm font-semibold text-green-600 mt-1">Match: {m.match_percent}%</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setAsMentor(m)}
                  disabled={saveLoadingMentor === m.userId}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-70 font-medium text-sm"
                >
                  {saveLoadingMentor === m.userId ? "Saving..." : "Set as Mentor"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && mentors.length === 0 && skills && (
        <div className="text-center py-12 text-gray-500">
          <p>No mentors found. Try different skills.</p>
        </div>
      )}
    </div>
  );
};

export default MentorRecommendation;
