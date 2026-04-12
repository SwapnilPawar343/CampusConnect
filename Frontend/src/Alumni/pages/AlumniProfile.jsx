import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { studentContext } from "../../context/studentContext";

const AlumniProfile = () => {
  const { getToken } = useContext(studentContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [loading, setLoading] = useState(true);
  const [answersCount, setAnswersCount] = useState(0);
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const bannerInputRef = useRef(null);
  const profileInputRef = useRef(null);

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
        const token = getToken();
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
          setProfileImage(profileData.alumni.profileImage || "");
          setBannerImage(profileData.alumni.bannerImage || "");
        } else {
          setProfile(alumniFromStorage);
          setProfileImage(alumniFromStorage.profileImage || "");
          setBannerImage(alumniFromStorage.bannerImage || "");
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
  }, [alumniFromStorage, backendUrl, getToken]);

  const alumni = profile || alumniFromStorage;
  const skills = Array.isArray(alumni.skils) ? alumni.skils : [];

  const saveMediaToStorage = (nextProfileImage, nextBannerImage) => {
    const current = JSON.parse(localStorage.getItem("alumni") || "{}");
    const updated = {
      ...current,
      profileImage: nextProfileImage ?? profileImage,
      bannerImage: nextBannerImage ?? bannerImage,
    };
    localStorage.setItem("alumni", JSON.stringify(updated));
    setProfile((prev) => ({ ...(prev || alumniFromStorage), ...updated }));
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

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-950 via-purple-900 to-indigo-950 p-6">
      <div className="max-w-4xl mx-auto bg-linear-to-br from-slate-900/80 to-slate-950/80 border border-pink-500/30 p-6 rounded-2xl shadow-xl backdrop-blur-xl">
        <div
          className={`h-36 rounded-xl mb-6 overflow-hidden ${bannerImage ? "" : "bg-linear-to-r from-indigo-600 to-purple-600"}`}
          style={bannerImage ? { backgroundImage: `url(${bannerImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        >
          {bannerImage && <div className="h-full w-full bg-black/25" />}
        </div>

        <h2 className="text-2xl font-semibold text-white mb-6">
          Alumni Profile
        </h2>

        {loading && (
          <div className="mb-6 rounded-lg bg-pink-500/15 border border-pink-400/40 px-4 py-3 text-sm text-pink-200">
            Loading profile data...
          </div>
        )}

        <div className="flex items-center gap-6 mb-6">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-28 h-28 rounded-full border border-pink-500/40 object-cover"
            />
          ) : (
            <img
              src="https://via.placeholder.com/120"
              alt="Profile"
              className="w-28 h-28 rounded-full border border-pink-500/40"
            />
          )}
          <div>
            <h3 className="text-xl font-semibold text-white">{alumni.name || "Alumni"}</h3>
            <span className="text-emerald-300 text-sm font-medium">
              ✔ Verified Alumni
            </span>
            <p className="text-sm text-purple-300 mt-2">{alumni.email || "No email available"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-pink-500/20 bg-slate-800/50 rounded-lg px-4 py-3">
            <p className="text-xs text-purple-300">Email</p>
            <p className="font-medium text-white">{alumni.email || "Not added"}</p>
          </div>
          <div className="border border-pink-500/20 bg-slate-800/50 rounded-lg px-4 py-3">
            <p className="text-xs text-purple-300">Department</p>
            <p className="font-medium text-white">{alumni.department || "Not added"}</p>
          </div>
          <div className="border border-pink-500/20 bg-slate-800/50 rounded-lg px-4 py-3">
            <p className="text-xs text-purple-300">Age</p>
            <p className="font-medium text-white">{alumni.age || "Not added"}</p>
          </div>
          <div className="border border-pink-500/20 bg-slate-800/50 rounded-lg px-4 py-3">
            <p className="text-xs text-purple-300">Graduation Year</p>
            <p className="font-medium text-white">{alumni.graduationYear || "Not added"}</p>
          </div>
          <div className="border border-pink-500/20 bg-slate-800/50 rounded-lg px-4 py-3">
            <p className="text-xs text-purple-300">Current Company</p>
            <p className="font-medium text-white">{alumni.currentCompany || "Not added"}</p>
          </div>
          <div className="border border-pink-500/20 bg-slate-800/50 rounded-lg px-4 py-3">
            <p className="text-xs text-purple-300">Mentees</p>
            <p className="font-medium text-white">{alumni.mentees?.length || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-800/50 border border-pink-500/20 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-pink-300">{alumni.mentees?.length || 0}</p>
            <p className="text-sm text-purple-300">Students Mentored</p>
          </div>
          <div className="bg-slate-800/50 border border-pink-500/20 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-pink-300">{answersCount}</p>
            <p className="text-sm text-purple-300">Total Answers Given</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-white mb-2">Bio</h3>
          <div className="rounded-lg border border-pink-500/20 bg-slate-800/50 px-4 py-3 text-purple-100">
            {alumni.bio || "No bio added yet."}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-white mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.length === 0 && (
              <span className="text-sm text-purple-300">No skills added.</span>
            )}
            {skills.map((skill, i) => (
              <span
                key={i}
                className="bg-linear-to-r from-pink-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-pink-500/20 pt-6">
          <h3 className="font-semibold text-white mb-3">Profile Media</h3>

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

          <div className="flex flex-wrap gap-3">
            <button
              className="bg-linear-to-r from-pink-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:from-pink-700 hover:to-purple-700"
              onClick={() => profileInputRef.current?.click()}
            >
              Change Profile Photo
            </button>
            <button
              className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700"
              onClick={() => bannerInputRef.current?.click()}
            >
              Change Banner
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AlumniProfile;
