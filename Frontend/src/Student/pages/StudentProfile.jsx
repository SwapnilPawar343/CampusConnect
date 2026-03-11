import React, { useState } from "react";

const StudentProfile = () => {

  // Get student data from localStorage
  const getInitialStudentData = () => {
    const studentData = localStorage.getItem("student");

    if (studentData) {
      try {
        return JSON.parse(studentData);
      } catch (error) {
        console.error("Error parsing student data:", error);
        return null;
      }
    }

    return null;
  };

  const initialStudent = getInitialStudentData();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(initialStudent?.name || "");
  const email = initialStudent?.email || "";
  const [age, setAge] = useState(initialStudent?.age?.toString() || "");
  const [department, setDepartment] = useState(initialStudent?.department || "");
  const [skills, setSkills] = useState(initialStudent?.skils || []);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const capitalizeName = (name) => {
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

  const handleSave = () => {
    const updatedStudent = {
      ...initialStudent,
      name : capitalizeName(name),
      age: parseInt(age),
      department,
      skils: skills,
    };

    localStorage.setItem("student", JSON.stringify(updatedStudent));
    setIsEditing(false);

    alert("Profile updated successfully!");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl h-36 relative">

          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 md:left-10 md:translate-x-0 flex flex-col md:flex-row items-center md:items-end gap-4">

            {/* Avatar */}
            <div className="relative">

              <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-white">

                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-black text-3xl font-bold">
                  {getInitials(name || "Student")}
                </div>

              </div>

              {/* <button className="absolute bottom-1 right-1 bg-white rounded-full p-2 shadow hover:shadow-lg">
                📷
              </button> */}

            </div>

            {/* Name */}
            <div className="text-black text-center md:text-left">

              <h1 className="text-3xl font-bold">
                {capitalizeName(name) || "Student Name"}
              </h1>

              <p className="text-indigo-400 mt-1">
                {department || "Department"}
              </p>

            </div>

          </div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-b-2xl shadow-xl pt-24 pb-10 px-8 mb-6">

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 shadow-sm hover:shadow-md">

              <p className="text-blue-600 text-sm font-medium">
                Skills
              </p>

              <p className="text-3xl font-bold text-blue-900 mt-1">
                {skills.length}
              </p>

            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200 shadow-sm hover:shadow-md">

              <p className="text-purple-600 text-sm font-medium">
                Department
              </p>

              <p className="text-lg font-bold text-purple-900 mt-1">
                {department || "N/A"}
              </p>

            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-5 border border-indigo-200 shadow-sm hover:shadow-md">

              <p className="text-indigo-600 text-sm font-medium">
                Email
              </p>

              <p className="text-sm font-bold text-indigo-900 mt-1">
                {email || "N/A"}
              </p>

            </div>

          </div>

          {/* EDIT BUTTON */}
          <div className="flex justify-end mb-6">

            {!isEditing ? (

              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 shadow-md"
              >
                Edit Profile
              </button>

            ) : (

              <div className="flex gap-3">

                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-6 py-2.5 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 shadow-md"
                >
                  Save Changes
                </button>

              </div>

            )}

          </div>

          {/* PERSONAL INFO */}
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

            <input
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
            />

            <input
              className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
              value={email}
              readOnly
            />

            <input
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={!isEditing}
            />

            <input
              className="border border-gray-300 rounded-lg px-4 py-3"
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              disabled={!isEditing}
            />

          </div>

          {/* SKILLS */}
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Skills & Expertise
          </h2>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">

            <div className="flex flex-wrap gap-3 mb-4">

              {skills.length > 0 ? (

                skills.map((skill, index) => (

                  <span
                    key={index}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:scale-105 transition"
                  >

                    {skill}

                    {isEditing && (
                      <button
                        onClick={() => removeSkill(index)}
                        className="bg-white text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    )}

                  </span>

                ))

              ) : (

                <p className="text-gray-400">
                  No skills added yet
                </p>

              )}

            </div>

            {isEditing && (

              <div className="flex gap-3">

                <input
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="Add skill (React, Python, DSA...)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />

                <button
                  onClick={addSkill}
                  className="bg-indigo-600 text-white px-6 rounded-lg"
                >
                  Add
                </button>

              </div>

            )}

          </div>

        </div>

        {/* ACCOUNT SETTINGS */}
        <div className="bg-white rounded-2xl shadow-xl p-6">

          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Account Settings
          </h3>

          <div className="flex flex-wrap gap-4">

            <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">
              Change Password
            </button>

            <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700">
              Privacy Settings
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentProfile;