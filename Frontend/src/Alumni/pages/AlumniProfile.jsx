import React from "react";
import Navbar from "../components/Navbar";

const AlumniProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Alumni Profile
        </h2>

        {/* Header */}
        <div className="flex items-center gap-6 mb-6">
          <img
            src="https://via.placeholder.com/120"
            alt="Profile"
            className="w-28 h-28 rounded-full border"
          />
          <div>
            <h3 className="text-xl font-semibold">John Doe</h3>
            <span className="text-green-600 text-sm font-medium">
              ✔ Verified Alumni
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border rounded-lg px-4 py-2" placeholder="Email" />
          <input className="border rounded-lg px-4 py-2" placeholder="Department Studied" />
          <input className="border rounded-lg px-4 py-2" placeholder="Passing Year" />
          <input className="border rounded-lg px-4 py-2" placeholder="Current Job Role" />
          <input className="border rounded-lg px-4 py-2" placeholder="Company Name" />
          <input className="border rounded-lg px-4 py-2" placeholder="Years of Experience" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">4.9 ⭐</p>
            <p className="text-sm text-gray-600">Mentorship Ranking</p>
          </div>
          <div className="bg-gray-50 border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">135</p>
            <p className="text-sm text-gray-600">Total Answers Given</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {["Java", "Spring Boot", "System Design"].map((skill, i) => (
              <span
                key={i}
                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
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

export default AlumniProfile;
