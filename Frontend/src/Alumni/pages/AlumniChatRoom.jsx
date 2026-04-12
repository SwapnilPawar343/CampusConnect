import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { studentContext } from "../../context/studentContext";

const AlumniChatRoom = () => {
  const { studentId } = useParams();
  const { getToken } = useContext(studentContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const alumni = JSON.parse(localStorage.getItem("alumni") || "{}");

  const [student, setStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  const loadChat = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/chats/alumni/${studentId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to load chat");
        return;
      }
      setStudent(data.student || null);
      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch (error) {
      console.error("Error loading chat:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChat();
    const interval = setInterval(loadChat, 4000);
    return () => clearInterval(interval);
  }, [backendUrl, getToken, studentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() && !file) return;
    try {
      setSending(true);
      const formData = new FormData();
      formData.append("message", text);
      if (file) formData.append("file", file);

      const response = await fetch(`${backendUrl}/api/chats/alumni/${studentId}/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to send message");
        return;
      }
      setText("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadChat();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-950 via-purple-900 to-indigo-950 p-0 md:p-6">
      <div className="mx-auto flex h-screen max-w-6xl overflow-hidden bg-slate-900/70 md:h-[88vh] md:rounded-3xl md:border md:border-pink-500/30 md:shadow-2xl md:backdrop-blur-xl">
        <aside className="hidden w-80 border-r border-pink-500/20 bg-slate-900/60 p-5 text-purple-100 lg:block">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-pink-300">Mentor Console</p>
          <h2 className="text-2xl font-bold text-white">Conversation</h2>
          <div className="mt-6 rounded-2xl border border-pink-500/30 bg-pink-500/10 p-4">
            <p className="text-sm text-purple-200">Student</p>
            <p className="mt-1 text-lg font-semibold text-white">{student?.name || "Loading..."}</p>
            <p className="mt-1 text-xs text-purple-300">You are replying as {alumni.name || "Mentor"}</p>
          </div>
        </aside>

        <section className="flex w-full flex-col">
        <div className="border-b border-pink-500/20 bg-linear-to-r from-pink-600/80 to-purple-700/80 px-4 py-3 text-white">
          <p className="font-bold text-lg">{student?.name || "Student"}</p>
          <p className="text-xs text-pink-100">Mentor: {alumni.name || "You"}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950/50 md:p-4">
          {loading ? (
            <p className="text-center text-purple-300">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-purple-300">No messages yet.</p>
          ) : (
            messages.map((msg) => {
              const mine = String(msg.sender) === String(alumni._id);
              return (
                <div key={msg._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[82%] rounded-2xl px-3 py-2 md:max-w-[68%] ${mine ? "bg-linear-to-r from-pink-600 to-purple-600 text-white" : "border border-pink-500/20 bg-slate-900/80 text-purple-100"}`}>
                    {msg.message && <p className="whitespace-pre-wrap">{msg.message}</p>}
                    {msg.fileUrl && (
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`block mt-2 underline text-sm ${mine ? "text-pink-100" : "text-pink-300"}`}
                      >
                        {msg.fileName || "Open attachment"}
                      </a>
                    )}
                    <p className={`text-[10px] mt-1 ${mine ? "text-pink-100" : "text-purple-400"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-pink-500/20 p-3 bg-slate-900/80 md:p-4">
          {file && <p className="text-xs text-purple-300 mb-2">Attached: {file.name}</p>}
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-lg bg-pink-500/20 text-pink-200 border border-pink-400/30"
            >
              +
            </button>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message"
              className="flex-1 rounded-lg border border-pink-500/30 bg-slate-800/60 px-3 py-2 text-white placeholder-purple-400"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 rounded-lg bg-linear-to-r from-pink-600 to-purple-600 text-white disabled:opacity-50"
              disabled={sending}
            >
              Send
            </button>
          </div>
        </div>
        </section>
      </div>
    </div>
  );
};

export default AlumniChatRoom;
