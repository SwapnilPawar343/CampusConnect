import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AddResource = () => {
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(returnTo)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition"
          >
            <ArrowLeft size={20} />
            Back to Resources
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Resource</h1>
          <p className="text-gray-600 mb-8">Share educational materials with the community</p>

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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your resource... (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows="5"
              />
            </div>

            {/* File Upload Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload File *
              </label>
              <div className="border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center hover:border-indigo-500 transition cursor-pointer">
                <input
                  type="file"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                  className="hidden"
                  id="file-input"
                  required
                />
                <label htmlFor="file-input" className="cursor-pointer block">
                  <div className="text-4xl mb-2">📎</div>
                  <p className="text-indigo-600 font-semibold mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-gray-500 text-sm">
                    Supports: Images, Videos, PDFs, Audio, PPT, DOCX, and more
                  </p>
                </label>
              </div>
              {formData.file && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-semibold">✓ File selected</p>
                  <p className="text-gray-600 text-sm">{formData.file.name}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate(returnTo)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-semibold py-3 rounded-lg transition"
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
