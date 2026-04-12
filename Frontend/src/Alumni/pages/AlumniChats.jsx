import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentContext } from "../../context/studentContext";

const AlumniChats = () => {
  const { getToken } = useContext(studentContext);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadConversations = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/chats/alumni/conversations`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await response.json();
      if (!response.ok) return;
      setConversations(Array.isArray(data.conversations) ? data.conversations : []);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [backendUrl, getToken]);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-950 via-purple-900 to-indigo-950 p-4 md:p-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-pink-500/30 bg-slate-900/70 p-5 shadow-2xl backdrop-blur-xl md:p-6">
        <h1 className="text-3xl font-bold text-white mb-1">My Chats</h1>
        <p className="mb-5 text-sm text-purple-200">Open any mentee conversation from the list below.</p>
        {loading ? (
          <p className="text-purple-300">Loading chats...</p>
        ) : conversations.length === 0 ? (
          <p className="text-purple-300">No mentee chats yet.</p>
        ) : (
          <div className="space-y-3">
            {conversations.map((item) => (
              <button
                key={item.student._id}
                onClick={() => navigate(`/alumni-chats/${item.student._id}`)}
                className="w-full rounded-2xl border border-pink-500/25 bg-slate-800/70 px-4 py-3 text-left transition hover:border-pink-400/60 hover:bg-slate-800"
              >
                <p className="font-semibold text-white">{item.student.name}</p>
                <p className="text-sm text-purple-300 truncate">
                  {item.lastMessage?.message || item.lastMessage?.fileName || "No messages yet"}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniChats;
