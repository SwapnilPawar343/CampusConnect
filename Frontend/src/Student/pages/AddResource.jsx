import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { studentContext } from "../../context/studentContext";

const AddResource = () => {
  const { getToken } = useContext(studentContext);
  const navigate = useNavigate();
  const location = useLocation();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const returnTo = location.state?.returnTo || "/student-resource";
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });

  const handleAddResource = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.file) {
      alert("Please enter a title and select a file.");
      return;
    }

    const multipartData = new FormData();
    multipartData.append("title", formData.title);
    multipartData.append("description", formData.description);
    multipartData.append("file", formData.file);

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/resources`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: multipartData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Resource added successfully!");
        navigate(returnTo);
      } else {
        alert(data.message || "Failed to add resource");
      }
    } catch (error) {
      console.error("Error adding resource:", error);
      alert("Failed to add resource. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-950 via-purple-900 to-indigo-950 p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(returnTo)}
            className="flex items-center gap-2 text-pink-300 hover:text-pink-200 font-semibold transition"
          >
            <ArrowLeft size={20} />
            Back to Resources
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-linear-to-br from-slate-900/80 to-slate-950/80 border border-pink-500/30 rounded-2xl shadow-xl backdrop-blur-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Add New Resource</h1>
          <p className="text-purple-200 mb-8">Share educational materials with the community</p>

          <form onSubmit={handleAddResource} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Resource Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter resource title (e.g., React Advanced Concepts)"
                className="w-full px-4 py-3 border border-pink-500/30 bg-slate-800/60 text-white placeholder-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/30 focus:border-pink-400"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-semibold text-purple-200 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your resource... (optional)"
                className="w-full px-4 py-3 border border-pink-500/30 bg-slate-800/60 text-white placeholder-purple-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/30 focus:border-pink-400 resize-none"
                rows="5"
              />
            </div>

            {/* File Upload Field */}
            <div>
              <label className="block text-sm font-semibold text-purple-200 mb-2">
                Upload File *
              </label>
              <div className="border-2 border-dashed border-pink-500/40 bg-slate-800/40 rounded-lg p-6 text-center hover:border-pink-400 transition cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                  className="hidden"
                  id="file-input"
                  required
                />
                <label htmlFor="file-input" className="cursor-pointer block">
                  <div className="text-4xl mb-2">📎</div>
                  <p className="text-pink-300 font-semibold mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-purple-300 text-sm">
                    Supports: Images, Videos, PDFs, Audio, PPT, DOCX, and more
                  </p>
                </label>
              </div>
              {formData.file && (
                <div className="mt-3 p-3 bg-emerald-500/15 border border-emerald-400/40 rounded-lg">
                  <p className="text-emerald-300 font-semibold">✓ File selected</p>
                  <p className="text-purple-100 text-sm">{formData.file.name}</p>
                  <p className="text-purple-300 text-xs mt-1">
                    {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-pink-500/20">
              <button
                type="button"
                onClick={() => navigate(returnTo)}
                className="flex-1 bg-slate-700/70 hover:bg-slate-700 text-purple-100 font-semibold py-3 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-70 text-white font-semibold py-3 rounded-lg transition"
              >
                {loading ? "Adding..." : "Add Resource"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddResource;
