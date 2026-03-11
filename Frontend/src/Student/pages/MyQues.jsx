import React, { useState, useContext } from "react";
import { studentContext } from "../../context/studentContext";
// import Navbar from "../components/Navbar";

const MyQues = () => {
  const { question: allQuestions, fetchQuestion } = useContext(studentContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReplyBox, setShowReplyBox] = useState({});
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // Get current user ID from localStorage
  const studentData = localStorage.getItem('student');
  const currentUserId = studentData ? JSON.parse(studentData)?._id : null;

  const hasReaction = (answer, type) => {
    const userId = String(currentUserId || "")
    if (!userId) return false

    const targetList = type === "like" ? answer?.likedBy : answer?.dislikedBy
    if (!Array.isArray(targetList)) return false

    return targetList.some((id) => String(id) === userId)
  }

  const capitalizeName = (value) => {
    if (!value) return "Anonymous"

    return value
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  // Filter questions asked by current user
  const myQuestions = currentUserId && Array.isArray(allQuestions) 
    ? allQuestions.filter(q => {
        return q.askedBy?._id === currentUserId;
      })
    : [];

  const filteredQuestions = myQuestions.filter(q =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleReaction = async (answerId, reaction) => {
    try {
      const response = await fetch(`${backendUrl}/api/questions/answers/${answerId}/reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ reaction }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to update reaction");
        return;
      }

      await fetchQuestion();
    } catch (error) {
      console.error("Error reacting to answer:", error);
      alert("Failed to update reaction.");
    }
  };

  const toggleAnswers = (questionId) => {
    setShowReplyBox((current) => ({
      ...current,
      [questionId]: !current[questionId],
    }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-950 via-purple-900 to-indigo-950 p-4 md:p-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-pink-500 opacity-20 blur-3xl mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-purple-500 opacity-20 blur-3xl mix-blend-multiply animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-2 text-sm font-semibold text-pink-200 backdrop-blur-xl">
            <span>Student Activity</span>
            <span className="h-1.5 w-1.5 rounded-full bg-pink-300"></span>
            <span>{filteredQuestions.length} Visible Questions</span>
          </div>
          <h1 className="mb-3 bg-clip-text text-4xl font-black text-transparent bg-linear-to-r from-pink-400 via-purple-300 to-pink-300 md:text-6xl">
            💬 My Questions
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-purple-200">
            Track your questions, review responses from alumni, and react to the answers that help most.
          </p>
        </div>

        <div className="mb-8 rounded-3xl border border-pink-500/20 bg-linear-to-br from-slate-900/80 to-slate-950/80 p-6 shadow-lg backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-300/80">Search History</p>
              <p className="mt-1 text-sm text-purple-300">Filter by title or description.</p>
            </div>
            <div className="rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
              {myQuestions.length} total asked
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-pink-500/30 bg-slate-800/50 px-4 py-3 transition focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-400/20">
            <span className="text-lg text-pink-300">⌕</span>
            <input
              type="text"
              placeholder="Search your questions..."
              className="w-full bg-transparent text-white outline-none placeholder:text-purple-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-5">
          {filteredQuestions.length === 0 ? (
            <div className="rounded-3xl border border-pink-500/30 bg-linear-to-br from-slate-900/80 to-slate-950/80 p-12 text-center shadow-lg backdrop-blur-xl">
              <div className="mb-4 text-5xl">🛰️</div>
              <p className="text-xl font-semibold text-purple-200">
                {searchQuery ? "No questions found matching your search." : "You haven't asked any questions yet!"}
              </p>
              <p className="mt-2 text-sm text-purple-400">
                {searchQuery ? "Try another keyword or clear the filter." : "Your posted questions will appear here once you start asking."}
              </p>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <div key={q._id} className="relative overflow-hidden rounded-3xl border border-pink-500/30 bg-linear-to-br from-slate-900/80 to-slate-950/80 p-6 shadow-lg backdrop-blur-xl transition hover:border-pink-400/60">
                <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-pink-400 via-purple-400 to-pink-500"></div>

                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1 pl-2">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-pink-400/30 bg-pink-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pink-200">
                        Posted by you
                      </span>
                      <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-200">
                        {q.answers?.length || 0} {(q.answers?.length || 0) === 1 ? "Answer" : "Answers"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white">{q.title}</h3>
                    <div className="mt-2 flex gap-3 text-sm text-purple-300">
                      <span>asked {formatTimestamp(q.createdAt)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleAnswers(q._id)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-pink-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-300/40"
                    aria-expanded={!!showReplyBox[q._id]}
                  >
                    {showReplyBox[q._id]
                      ? "Hide Answers"
                      : `See ${q.answers?.length || 0} ${(q.answers?.length || 0) === 1 ? "Answer" : "Answers"}`}
                    <svg className={`h-4 w-4 transition-transform ${showReplyBox[q._id] ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <p className="mb-4 mt-4 pl-2 leading-7 text-purple-200">{q.description}</p>

                {showReplyBox[q._id] && (
                  <div className="mt-5 rounded-2xl border border-pink-500/20 bg-slate-800/40 p-4 shadow-sm backdrop-blur-xl">
                    <div className="mb-4 flex flex-col gap-3 border-b border-pink-500/20 pb-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h4 className="text-base font-semibold text-white">Answers for this question</h4>
                        <p className="text-sm text-purple-300">
                          Read the replies below and hide them anytime.
                        </p>
                      </div>
                      <button
                        onClick={() => toggleAnswers(q._id)}
                        className="inline-flex items-center justify-center rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-200 transition hover:bg-pink-500/20"
                      >
                        Hide Answers
                      </button>
                    </div>

                    {q.answers && q.answers.length > 0 ? (
                      <div className="max-h-80 space-y-3 overflow-auto pr-1">
                        {q.answers.map((answer) => (
                          <div key={answer._id} className="rounded-2xl border border-purple-400/20 bg-slate-900/70 p-4">
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <div className="flex-1">
                                <p className="text-purple-100">
                                  {answer.content || answer.text || answer.description || "No answer content"}
                                </p>
                                <div className="mt-2 flex gap-2 text-xs text-purple-400">
                                  <span className="font-medium text-pink-300">{capitalizeName(answer.answeredBy?.name)}</span>
                                  <span>•</span>
                                  <span>{formatTimestamp(answer.createdAt)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-3">
                              <button
                                onClick={() => handleReaction(answer._id, "like")}
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${hasReaction(answer, "like") ? "border-green-400/50 bg-green-500/20 text-green-300" : "border-green-400/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"}`}
                              >
                                👍 Like ({answer.likedBy?.length || 0})
                              </button>
                              <button
                                onClick={() => handleReaction(answer._id, "dislike")}
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${hasReaction(answer, "dislike") ? "border-red-400/50 bg-red-500/20 text-red-300" : "border-red-400/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"}`}
                              >
                                👎 Dislike ({answer.dislikedBy?.length || 0})
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-purple-400/20 bg-slate-900/60 px-4 py-5 text-sm text-purple-300">
                        No answers yet. Check back later!
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyQues;
