import React, { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentResource = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendUrl}/api/resources/myresources`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setResources(Array.isArray(data?.resources) ? data.resources : []);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [backendUrl]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`${backendUrl}/api/resources/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        alert("Resource deleted successfully!");
        setResources(resources.filter((item) => item._id !== id));
        setOpenMenu(null);
      } else {
        alert("Failed to delete resource");
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      alert("Failed to delete resource. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const filteredResources = resources.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-pink-300">
          📚 My Resources
        </h1>
        <p className="text-purple-200 mb-8">Manage your learning materials</p>

        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-8">
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-2/3 px-4 py-3 rounded-xl border-2 border-pink-500/30 bg-slate-800/50 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 text-white placeholder-purple-400 shadow-sm transition"
          />

          <button
            onClick={() => navigate("/add-resource", { state: { returnTo: "/student-resource" } })}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-md transition duration-300 whitespace-nowrap font-bold"
          >
            + Add Resource
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-purple-300">Loading resources...</p>
          </div>
        )}

        {/* Resource Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {filteredResources.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-2xl border border-pink-500/30 backdrop-blur-xl">
              <p className="text-purple-300 text-lg">
                {resources.length === 0
                  ? "No resources yet. Add one to get started!"
                  : "No resources found matching your search."}
              </p>
            </div>
          ) : (
            filteredResources.map((resource) => (
              <div
                key={resource._id}
                onClick={() => {
                  window.open(resource.url, "_blank");
                }}
                className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer border border-pink-500/30 hover:border-pink-400/60 backdrop-blur-xl overflow-hidden"
              >
                {/* Image placeholder - Using default based on file type */}
                {resource.fileType === "image" ? (
                  <img
                    src={resource.url}
                    alt={resource.title}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-pink-500/30 to-purple-500/30 flex items-center justify-center text-white text-4xl font-bold">
                    {resource.fileType === "video" && "🎥"}
                    {resource.fileType === "pdf" && "📄"}
                    {resource.fileType === "audio" && "🎵"}
                    {resource.fileType === "ppt" && "📊"}
                    {resource.fileType === "docx" && "📝"}
                    {resource.fileType === "other" && "📦"}
                  </div>
                )}

                <div className="p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-pink-400 mt-1 font-medium">
                      {resource.fileType}
                    </p>
                  </div>

                  {/* Dropdown */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === resource._id ? null : resource._id);
                      }}
                      className="p-2 rounded-full hover:bg-pink-500/20 transition text-pink-400"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openMenu === resource._id && (
                      <div className="absolute right-0 mt-2 w-36 bg-slate-900/90 rounded-xl shadow-lg border border-pink-500/30 z-50 backdrop-blur-xl" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-left px-4 py-2 hover:bg-pink-500/20 rounded-t-xl text-purple-200 hover:text-pink-300 transition"
                        >
                          View
                        </a>
                        <a
                          href={resource.url}
                          download
                          className="block w-full text-left px-4 py-2 hover:bg-pink-500/20 text-purple-200 hover:text-pink-300 transition"
                        >
                          Download
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(resource._id);
                          }}
                          disabled={deleting === resource._id}
                          className="block w-full text-left px-4 py-2 text-pink-400 hover:bg-pink-500/30 rounded-b-xl disabled:opacity-50 transition"
                        >
                          {deleting === resource._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default StudentResource;
