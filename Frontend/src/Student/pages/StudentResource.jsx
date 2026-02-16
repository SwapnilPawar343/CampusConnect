import React, { useState } from "react";
import { MoreVertical } from "lucide-react";

const StudentResource = () => {
  const [resources, setResources] = useState([
    {
      id: 1,
      title: "React Notes",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    },
    {
      id: 2,
      title: "DSA Handbook",
      image:
        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f",
    },
  ]);

  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const handleDelete = (id) => {
    setResources(resources.filter((item) => item.id !== id));
  };

  const filteredResources = resources.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        My Resources
      </h1>

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-8">
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-2/3 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
        />

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl shadow-md transition duration-300">
          + Add Resource
        </button>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
          >
            {/* Image with rounded top only */}
            <img
              src={resource.image}
              alt={resource.title}
              className="w-full h-40 object-cover rounded-t-2xl"
            />

            <div className="p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">
                {resource.title}
              </h3>

              {/* Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === resource.id ? null : resource.id)
                  }
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                  <MoreVertical size={18} />
                </button>

                {openMenu === resource.id && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border z-50">
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-xl">
                      View
                    </button>
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-b-xl"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentResource;
