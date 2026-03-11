import React, { useContext, useMemo, useState } from "react";
import { studentContext } from "../../context/studentContext";

const Quations = () => {
  const { question, fetchQuestion } = useContext(studentContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [answerInputs, setAnswerInputs] = useState({});
  const [openAnswerBox, setOpenAnswerBox] = useState({});
  const [submittingId, setSubmittingId] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const alumniId = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("alumni") || "{}")?._id || null;
    } catch (error) {
      console.error("Failed to parse alumni data:", error);
      return null;
    }
  }, []);

  const questions = Array.isArray(question) ? question : [];

  const filteredQuestions = questions.filter((item) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
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

  const capitalizeName = (value) => {
    if (!value) return "Student";

    return value
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const hasAnsweredQuestion = (item) =>
    Array.isArray(item.answers) &&
    item.answers.some((answer) => String(answer.answeredBy?._id || answer.answeredBy) === String(alumniId));

  const handleSubmitAnswer = async (questionId) => {
    const content = answerInputs[questionId]?.trim();
    if (!content) {
      alert("Please write an answer before submitting.");
      return;
    }

    try {
      setSubmittingId(questionId);
      const response = await fetch(`${backendUrl}/api/questions/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ quationId: questionId, content }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to submit answer");
        return;
      }

      setAnswerInputs((current) => ({ ...current, [questionId]: "" }));
      setOpenAnswerBox((current) => ({ ...current, [questionId]: false }));
      await fetchQuestion();
      alert("Answer added successfully!");
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Failed to submit answer.");
    } finally {
      setSubmittingId("");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-950 via-purple-900 to-indigo-950 p-4 md:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-2 text-sm font-semibold text-pink-200 backdrop-blur-xl mb-5">
            <span>Alumni Help Desk</span>
            <span className="h-1.5 w-1.5 rounded-full bg-pink-300"></span>
            <span>{filteredQuestions.length} Open Matches</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-3 bg-clip-text text-transparent bg-linear-to-r from-pink-400 via-purple-300 to-pink-300">
            ❓ Student Questions
          </h1>
          <p className="mx-auto max-w-2xl text-purple-200 text-lg">
            Help students with clear, practical answers and keep the community knowledge flowing.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-linear-to-br from-slate-900/80 to-slate-950/80 p-6 rounded-3xl shadow-lg mb-8 border border-pink-500/20 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-300/80">Search Queue</p>
              <p className="mt-1 text-sm text-purple-300">Filter by title or question description.</p>
            </div>
            <div className="rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
              {questions.length} total questions
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-pink-500/30 bg-slate-800/50 px-4 py-3 focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-400/20 transition">
            <span className="text-lg text-pink-300">⌕</span>
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full bg-transparent text-white placeholder-purple-400 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="bg-linear-to-br from-slate-900/80 to-slate-950/80 p-12 rounded-3xl shadow-lg text-center border border-pink-500/30 backdrop-blur-xl">
              <div className="mb-4 text-5xl">🪄</div>
              <p className="text-purple-200 text-xl font-semibold">
                {searchQuery ? "No questions found matching your search." : "No questions available right now."}
              </p>
              <p className="mt-2 text-sm text-purple-400">
                {searchQuery ? "Try a different keyword or remove the search filter." : "New student questions will appear here when they are posted."}
              </p>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <div key={q._id} className="relative overflow-hidden bg-linear-to-br from-slate-900/80 to-slate-950/80 p-6 rounded-3xl shadow-lg border border-pink-500/30 hover:border-pink-400/60 backdrop-blur-xl transition">
                <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-pink-400 via-purple-400 to-pink-500"></div>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex-1 pl-2">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-pink-400/30 bg-pink-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pink-200">
                        Student Query
                      </span>
                      <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-200">
                        {q.answers?.length || 0} replies
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{q.title}</h3>
                    <div className="flex gap-3 mt-2 text-sm text-purple-300">
                      <span className="font-medium">by {capitalizeName(q.askedBy?.name)}</span>
                      <span>•</span>
                      <span>{formatTimestamp(q.createdAt)}</span>
                    </div>
                  </div>
                  {hasAnsweredQuestion(q) && (
                    <span className="rounded-full bg-linear-to-r from-green-500/30 to-emerald-500/30 border border-green-400/50 px-3 py-1 text-xs font-semibold text-green-300">
                      ✓ Answered
                    </span>
                  )}
                </div>

                <p className="mb-6 pl-2 text-purple-200 leading-7">{q.description}</p>

                <div className="border-t border-pink-500/20 pt-6 mt-6 pl-2">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
                    <h4 className="font-bold text-white">
                      💬 {q.answers?.length || 0} {(q.answers?.length || 0) === 1 ? "Answer" : "Answers"}
                    </h4>
                    <button
                      onClick={() => setOpenAnswerBox((current) => ({ ...current, [q._id]: !current[q._id] }))}
                      className="text-sm bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
                      disabled={hasAnsweredQuestion(q)}
                    >
                      {openAnswerBox[q._id] ? "Cancel" : hasAnsweredQuestion(q) ? "Already Answered" : "Add Answer"}
                    </button>
                  </div>

                  {openAnswerBox[q._id] && !hasAnsweredQuestion(q) && (
                    <div className="mb-4 space-y-3">
                      <textarea
                        placeholder="Write your answer..."
                        className="w-full bg-slate-800/50 border-2 border-pink-500/30 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 text-white placeholder-purple-400 resize-none transition"
                        rows="4"
                        value={answerInputs[q._id] || ""}
                        onChange={(e) => setAnswerInputs((current) => ({ ...current, [q._id]: e.target.value }))}
                      />
                      <button
                        onClick={() => handleSubmitAnswer(q._id)}
                        disabled={submittingId === q._id}
                        className="w-full bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-bold transition disabled:opacity-50"
                      >
                        {submittingId === q._id ? "Submitting..." : "Submit Answer"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Quations;
