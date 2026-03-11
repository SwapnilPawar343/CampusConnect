import React, { useEffect, useMemo, useState } from "react";

const AlumniProfile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [loading, setLoading] = useState(true);
  const [answersCount, setAnswersCount] = useState(0);
  const [profile, setProfile] = useState(null);

  const alumniFromStorage = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("alumni") || "{}");
    } catch (error) {
      console.error("Failed to parse alumni data:", error);
      return {};
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const alumniId = alumniFromStorage._id || "current";

        const [profileResponse, answersResponse] = await Promise.all([
          fetch(`${backendUrl}/api/alumni/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch(`${backendUrl}/api/questions/myanswers/${alumniId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        const profileData = await profileResponse.json();
        const answersData = await answersResponse.json();

        if (profileResponse.ok && profileData.alumni) {
          setProfile(profileData.alumni);
          localStorage.setItem("alumni", JSON.stringify(profileData.alumni));
        } else {
          setProfile(alumniFromStorage);
        }

        if (answersResponse.ok) {
          setAnswersCount(Array.isArray(answersData) ? answersData.length : 0);
        }
      } catch (error) {
        console.error("Error fetching alumni profile:", error);
        setProfile(alumniFromStorage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [alumniFromStorage, backendUrl]);

  const alumni = profile || alumniFromStorage;
  const skills = Array.isArray(alumni.skils) ? alumni.skils : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Alumni Profile
        </h2>

        {loading && (
          <div className="mb-6 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Loading profile data...
          </div>
        )}

        <div className="flex items-center gap-6 mb-6">
          <img
            src="https://via.placeholder.com/120"
            alt="Profile"
            className="w-28 h-28 rounded-full border"
          />
          <div>
            <h3 className="text-xl font-semibold">{alumni.name || "Alumni"}</h3>
            <span className="text-green-600 text-sm font-medium">
              ✔ Verified Alumni
            </span>
            <p className="text-sm text-gray-500 mt-2">{alumni.email || "No email available"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-medium text-gray-800">{alumni.email || "Not added"}</p>
          </div>
          <div className="border rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500">Department</p>
            <p className="font-medium text-gray-800">{alumni.department || "Not added"}</p>
          </div>
          <div className="border rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500">Age</p>
            <p className="font-medium text-gray-800">{alumni.age || "Not added"}</p>
          </div>
          <div className="border rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500">Graduation Year</p>
            <p className="font-medium text-gray-800">{alumni.graduationYear || "Not added"}</p>
          </div>
          <div className="border rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500">Current Company</p>
            <p className="font-medium text-gray-800">{alumni.currentCompany || "Not added"}</p>
          </div>
          <div className="border rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500">Mentees</p>
            <p className="font-medium text-gray-800">{alumni.mentees?.length || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">{alumni.mentees?.length || 0}</p>
            <p className="text-sm text-gray-600">Students Mentored</p>
          </div>
          <div className="bg-gray-50 border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">{answersCount}</p>
            <p className="text-sm text-gray-600">Total Answers Given</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">Bio</h3>
          <div className="rounded-lg border bg-gray-50 px-4 py-3 text-gray-700">
            {alumni.bio || "No bio added yet."}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.length === 0 && (
              <span className="text-sm text-gray-500">No skills added.</span>
            )}
            {skills.map((skill, i) => (
              <span
                key={i}
                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AlumniProfile;
