import React, { useContext, useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { studentContext } from "../../context/studentContext";

const AlumniResource = () => {
  const { getToken } = useContext(studentContext);
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
            Authorization: `Bearer ${getToken()}`,
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
  }, [backendUrl, getToken]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`${backendUrl}/api/resources/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (response.ok) {
        alert("Resource deleted successfully!");
        setResources((current) => current.filter((item) => item._id !== id));
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
    <div className="min-h-screen bg-linear-to-br from-purple-950 via-purple-900 to-indigo-950 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Resources</h1>
      <p className="text-purple-200 mb-6">Manage your uploaded learning materials</p>

      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-8">
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-2/3 px-4 py-3 rounded-xl border border-pink-500/30 bg-slate-800/60 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-pink-400/30 shadow-sm"
        />

        <button
          onClick={() => navigate("/add-resource", { state: { returnTo: "/alumni-resource" } })}
          className="bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-md transition duration-300 whitespace-nowrap"
        >
          + Add Resource
        </button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-purple-300">Loading resources...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {filteredResources.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-linear-to-br from-slate-900/80 to-slate-950/80 rounded-2xl border border-pink-500/30 backdrop-blur-xl">
              <p className="text-purple-300">
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
                className="bg-linear-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border border-pink-500/25"
              >
                {resource.fileType === "image" ? (
                  <img
                    src={resource.url}
                    alt={resource.title}
                    className="w-full h-40 object-cover rounded-t-2xl"
                  />
                ) : (
                  <div className="w-full h-40 bg-linear-to-br from-pink-600/30 to-purple-600/30 rounded-t-2xl flex items-center justify-center text-white text-3xl font-bold">
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
                    <h3 className="text-lg font-semibold text-white line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-purple-300 mt-1">{resource.fileType}</p>
                  </div>

                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === resource._id ? null : resource._id);
                      }}
                      className="p-2 rounded-full hover:bg-pink-500/20 transition text-pink-300"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openMenu === resource._id && (
                      <div className="absolute right-0 mt-2 w-36 bg-slate-900 rounded-xl shadow-lg border border-pink-500/30 z-50 backdrop-blur-xl" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-left px-4 py-2 hover:bg-pink-500/20 rounded-t-xl text-purple-100"
                        >
                          View
                        </a>
                        <a
                          href={resource.url}
                          download
                          className="block w-full text-left px-4 py-2 hover:bg-pink-500/20 text-purple-100"
                        >
                          Download
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(resource._id);
                          }}
                          disabled={deleting === resource._id}
                          className="block w-full text-left px-4 py-2 text-red-300 hover:bg-red-500/20 rounded-b-xl disabled:opacity-50"
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
  );
};

export default AlumniResource;