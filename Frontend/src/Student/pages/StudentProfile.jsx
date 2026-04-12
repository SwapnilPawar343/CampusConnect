import React, { useRef, useState } from "react";

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
  const [profileImage, setProfileImage] = useState(initialStudent?.profileImage || "");
  const [bannerImage, setBannerImage] = useState(initialStudent?.bannerImage || "");
  const [newSkill, setNewSkill] = useState("");
  const bannerInputRef = useRef(null);
  const profileInputRef = useRef(null);

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
      profileImage,
      bannerImage,
    };

    localStorage.setItem("student", JSON.stringify(updatedStudent));
    setIsEditing(false);

    alert("Profile updated successfully!");
  };

  const saveMediaToStorage = (nextProfileImage, nextBannerImage) => {
    const current = JSON.parse(localStorage.getItem("student") || "{}");
    const updated = {
      ...current,
      profileImage: nextProfileImage ?? profileImage,
      bannerImage: nextBannerImage ?? bannerImage,
    };
    localStorage.setItem("student", JSON.stringify(updated));
  };

  const handleImageUpload = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      if (type === "profile") {
        setProfileImage(dataUrl);
        saveMediaToStorage(dataUrl, undefined);
      } else {
        setBannerImage(dataUrl);
        saveMediaToStorage(undefined, dataUrl);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // const capitalizeName = (str) => {
  //   if (!str) return 'Student';
  //   return str
  //     .split(' ')
  //     .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  //     .join(' ');
  // };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-950 via-purple-900 to-indigo-950">

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">

        {/* HEADER */}
        <div
          className={`rounded-t-2xl h-36 relative overflow-hidden ${bannerImage ? "" : "bg-linear-to-r from-indigo-600 to-purple-600"}`}
          style={bannerImage ? { backgroundImage: `url(${bannerImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        >
          {bannerImage && <div className="absolute inset-0 bg-black/25" />}

          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 md:left-10 md:translate-x-0 flex flex-col md:flex-row items-center md:items-end gap-4">

            {/* Avatar */}
            <div className="relative">

              <div className="w-32 h-32 rounded-full bg-slate-900 shadow-xl flex items-center justify-center border-4 border-pink-500/40">

                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-linear-to-br from-pink-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                    {getInitials(name || "Student")}
                  </div>
                )}

              </div>

              {/* <button className="absolute bottom-1 right-1 bg-white rounded-full p-2 shadow hover:shadow-lg">
                📷
              </button> */}

            </div>

            {/* Name */}
            <div className="text-white text-center md:text-left">

              <h1 className="text-3xl font-bold">
                {capitalizeName(name) || "Student Name"}
              </h1>

              <p className="text-pink-200 mt-1">
                {department || "Department"}
              </p>

            </div>

          </div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-linear-to-br from-slate-900/80 to-slate-950/80 border border-pink-500/30 rounded-b-2xl shadow-xl pt-24 pb-10 px-8 mb-6 backdrop-blur-xl">

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            <div className="bg-linear-to-br from-slate-800/70 to-slate-900/70 rounded-xl p-5 border border-pink-500/20 shadow-sm hover:shadow-md">

              <p className="text-pink-300 text-sm font-medium">
                Skills
              </p>

              <p className="text-3xl font-bold text-white mt-1">
                {skills.length}
              </p>

            </div>

            <div className="bg-linear-to-br from-slate-800/70 to-slate-900/70 rounded-xl p-5 border border-pink-500/20 shadow-sm hover:shadow-md">

              <p className="text-pink-300 text-sm font-medium">
                Department
              </p>

              <p className="text-lg font-bold text-white mt-1">
                {department || "N/A"}
              </p>

            </div>

            <div className="bg-linear-to-br from-slate-800/70 to-slate-900/70 rounded-xl p-5 border border-pink-500/20 shadow-sm hover:shadow-md">

              <p className="text-pink-300 text-sm font-medium">
                Email
              </p>

              <p className="text-sm font-bold text-white mt-1">
                {email || "N/A"}
              </p>

            </div>

          </div>

          {/* EDIT BUTTON */}
          <div className="flex justify-end mb-6">

            {!isEditing ? (

              <button
                onClick={() => setIsEditing(true)}
                className="bg-linear-to-r from-pink-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 shadow-md"
              >
                Edit Profile
              </button>

            ) : (

              <div className="flex gap-3">

                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-700 text-white px-6 py-2.5 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 shadow-md"
                >
                  Save Changes
                </button>

              </div>

            )}

          </div>

          {/* PERSONAL INFO */}
          <h2 className="text-xl font-bold text-white mb-4">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

            <input
              className="border border-pink-500/30 bg-slate-800/60 text-white rounded-lg px-4 py-3 placeholder-purple-400"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
            />

            <input
              className="border border-pink-500/30 bg-slate-800/40 text-purple-200 rounded-lg px-4 py-3"
              value={email}
              readOnly
            />

            <input
              className="border border-pink-500/30 bg-slate-800/60 text-white rounded-lg px-4 py-3 placeholder-purple-400"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={!isEditing}
            />

            <input
              className="border border-pink-500/30 bg-slate-800/60 text-white rounded-lg px-4 py-3 placeholder-purple-400"
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              disabled={!isEditing}
            />

          </div>

          {/* SKILLS */}
          <h2 className="text-xl font-bold text-white mb-4">
            Skills & Expertise
          </h2>

          <div className="bg-slate-800/40 rounded-xl p-6 border border-pink-500/20">

            <div className="flex flex-wrap gap-3 mb-4">

              {skills.length > 0 ? (

                skills.map((skill, index) => (

                  <span
                    key={index}
                    className="flex items-center gap-2 bg-linear-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:scale-105 transition"
                  >

                    {skill}

                    {isEditing && (
                      <button
                        onClick={() => removeSkill(index)}
                        className="bg-white text-purple-700 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    )}

                  </span>

                ))

              ) : (

                <p className="text-purple-300">
                  No skills added yet
                </p>

              )}

            </div>

            {isEditing && (

              <div className="flex gap-3">

                <input
                  className="flex-1 border border-pink-500/30 bg-slate-800/60 text-white placeholder-purple-400 rounded-lg px-4 py-3"
                  placeholder="Add skill (React, Python, DSA...)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />

                <button
                  onClick={addSkill}
                  className="bg-linear-to-r from-pink-600 to-purple-600 text-white px-6 rounded-lg"
                >
                  Add
                </button>

              </div>

            )}

          </div>

        </div>

        {/* ACCOUNT SETTINGS */}
        <div className="bg-linear-to-br from-slate-900/80 to-slate-950/80 border border-pink-500/30 rounded-2xl shadow-xl p-6 backdrop-blur-xl">

          <h3 className="text-lg font-bold text-white mb-4">
            Account Settings
          </h3>

          <div className="flex flex-wrap gap-4">

            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleImageUpload(event, "profile")}
            />

            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleImageUpload(event, "banner")}
            />

            <button
              className="bg-linear-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700"
              onClick={() => profileInputRef.current?.click()}
            >
              Change Profile Photo
            </button>

            <button
              className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700"
              onClick={() => bannerInputRef.current?.click()}
            >
              Change Banner
            </button>

            <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
              Change Password
            </button>

            <button className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600">
              Privacy Settings
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default StudentProfile;