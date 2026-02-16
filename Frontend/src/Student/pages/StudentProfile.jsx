import React, { useState } from "react";
import Navbar from "../components/Navbar";

const StudentProfile = () => {
  const [skills, setSkills] = useState(["React", "DSA", "Machine Learning"]);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Student Profile
        </h2>

        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-6">
          <img
            src="https://via.placeholder.com/120"
            alt="Profile"
            className="w-28 h-28 rounded-full border"
          />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            Change Photo
          </button>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border rounded-lg px-4 py-2" placeholder="Full Name" />
          <input
            className="border rounded-lg px-4 py-2 bg-gray-100"
            value="student@college.edu"
            readOnly
          />
          <input className="border rounded-lg px-4 py-2" placeholder="Department / Branch" />
          <input className="border rounded-lg px-4 py-2" placeholder="Year of Study" />
          <input
            className="border rounded-lg px-4 py-2 md:col-span-2"
            placeholder="Predicted Career Role"
          />
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              className="border rounded-lg px-4 py-2 flex-1"
              placeholder="Add skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button
              onClick={addSkill}
              className="bg-indigo-600 text-white px-4 rounded-lg hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
            Edit Profile
          </button>
          <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
