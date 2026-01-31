import React, { useState } from "react";

const MentorRecommendation = () => {
  const [skills, setSkills] = useState("");
  const [mentors, setMentors] = useState([]);

  const recommend = () => {
    setMentors([
      { id: 1, name: "Amit Sharma", role: "SDE @ Google" },
      { id: 2, name: "Neha Verma", role: "Data Scientist @ Amazon" },
      { id: 3, name: "Rahul Mehta", role: "ML Engineer" },
      { id: 4, name: "Sneha Patil", role: "Product Manager" },
      { id: 5, name: "Karan Singh", role: "DevOps Lead" }
    ]);
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
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Recommend Mentors
        </button>
      </div>

      {/* Mentor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((m) => (
          <div key={m.id} className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{m.name}</h3>
            <p className="text-gray-600">{m.role}</p>

            <div className="flex gap-3 mt-4">
              <button className="text-indigo-600 font-medium">
                View Profile
              </button>
              <button className="text-green-600 font-medium">
                Ask Question
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentorRecommendation;
