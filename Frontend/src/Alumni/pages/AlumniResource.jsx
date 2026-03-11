import React, { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AlumniResource = () => {
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Resources</h1>

      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-8">
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-2/3 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
        />

        <button
          onClick={() => navigate("/add-resource", { state: { returnTo: "/alumni-resource" } })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl shadow-md transition duration-300 whitespace-nowrap"
        >
          + Add Resource
        </button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading resources...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {filteredResources.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl">
              <p className="text-gray-500">
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
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
              >
                {resource.fileType === "image" ? (
                  <img
                    src={resource.url}
                    alt={resource.title}
                    className="w-full h-40 object-cover rounded-t-2xl"
                  />
                ) : (
                  <div className="w-full h-40 bg-linear-to-br from-indigo-300 to-blue-400 rounded-t-2xl flex items-center justify-center text-white text-3xl font-bold">
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
                    <h3 className="text-lg font-semibold text-gray-700 line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{resource.fileType}</p>
                  </div>

                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === resource._id ? null : resource._id);
                      }}
                      className="p-2 rounded-full hover:bg-gray-200 transition"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openMenu === resource._id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border z-50" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-xl"
                        >
                          View
                        </a>
                        <a
                          href={resource.url}
                          download
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Download
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(resource._id);
                          }}
                          disabled={deleting === resource._id}
                          className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-b-xl disabled:opacity-50"
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