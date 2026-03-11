import React, { useState, useContext } from "react";
import { studentContext } from "../../context/studentContext";

const QnA = () => {
  const questionContext = useContext(studentContext);
  const { question: questions } = questionContext;
  const [searchQuery, setSearchQuery] = useState("");
  const [showAskPanel, setShowAskPanel] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const studentData = localStorage.getItem("student");
  const currentUserId = studentData ? JSON.parse(studentData)?._id : null;

  const questionsArray = Array.isArray(questions) ? questions : [];

  const hasReaction = (answer, type) => {
    const userId = String(currentUserId || "")
    if (!userId) return false

    const targetList = type === "like" ? answer?.likedBy : answer?.dislikedBy
    if (!Array.isArray(targetList)) return false

    return targetList.some((id) => String(id) === userId)
  }

  const filteredQuestions = questionsArray.filter(q =>
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
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    const title = e.target[0].value;
    const description = e.target[1].value;
    
    try {
      const response = await fetch(`${backendUrl}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, description })
      });
      
      if (response.ok) {
        alert('Question submitted successfully!');
        e.target.reset();
        setShowAskPanel(false);
        // Refresh the questions list
        questionContext.fetchQuestion();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to submit question');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('An error occurred while submitting your question.');
    }
  }

  const handleReaction = async (answerId, reaction) => {
    try {
      const response = await fetch(`${backendUrl}/api/questions/answers/${answerId}/reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ reaction })
      })

      const data = await response.json()
      if (!response.ok) {
        alert(data.message || "Failed to update reaction")
        return
      }

      await questionContext.fetchQuestion()
    } catch (error) {
      console.error("Error reacting to answer:", error)
      alert("Failed to update reaction.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-slate-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-slate-300">
            💬 Q&A Forum
          </h1>
          <p className="text-slate-400 text-lg">Ask questions, share knowledge, and grow together</p>
        </div>

        {/* Search Bar and Ask Question Button */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg mb-8 border border-slate-600/40 backdrop-blur-xl flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search questions..."
            className="flex-1 bg-slate-700/30 border-2 border-slate-600/50 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-slate-500 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => setShowAskPanel(!showAskPanel)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-bold transition whitespace-nowrap"
          >
            {showAskPanel ? "✕ Cancel" : "❓ Ask Question"}
          </button>
        </div>

        {/* Ask Question Panel - Toggleable */}
        {showAskPanel && (
          <form className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-lg mb-8 space-y-4 border border-slate-600/40 backdrop-blur-xl" onSubmit={handleAskQuestion}>
            <h2 className="text-2xl font-bold text-white">✏️ Ask a Question</h2>
            
            <input
              type="text"
              placeholder="Question Title"
              className="w-full bg-slate-700/30 border-2 border-slate-600/50 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-slate-500 transition"
              required
            />

            <textarea
              placeholder="Describe your question in detail..."
              className="w-full bg-slate-700/30 border-2 border-slate-600/50 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-slate-500 transition resize-none"
              rows="4"
            />

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-bold transition"
            >
              Submit Question
            </button>
          </form>
        )}

        {/* Question Feed */}
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-12 rounded-2xl shadow-lg text-center border border-slate-600/40 backdrop-blur-xl">
              <p className="text-slate-400 text-lg">{searchQuery ? "No questions found matching your search." : "No questions yet. Be the first to ask!"}</p>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <div key={q._id} className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg border border-slate-600/40 backdrop-blur-xl hover:border-slate-500/60 transition">
                {/* Question Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{q.title}</h3>
                    <div className="flex gap-3 mt-2 text-sm text-slate-400">
                      <span className="font-medium">by {q.askedBy?.name || "Anonymous"}</span>
                      <span>•</span>
                      <span>{formatTimestamp(q.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Question Description */}
                <p className="text-slate-300 mb-4">{q.description}</p>

                {/* Answers Section */}
                <div className="border-t border-slate-600/40 pt-6 mt-6">
                  <h4 className="font-bold text-white mb-4">
                    📝 {q.answers?.length || 0} {(q.answers?.length || 0) === 1 ? "Answer" : "Answers"}
                  </h4>

                  {/* Answers List */}
                  {q.answers && q.answers.length > 0 ? (
                    <div className="space-y-3">
                      {q.answers.map((answer) => (
                        <div key={answer._id} className="bg-slate-700/30 border border-slate-600/30 p-4 rounded-xl">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <p className="text-slate-200">{answer.content || answer.text || answer.description || "No answer content"}</p>
                              <div className="flex gap-2 mt-2 text-xs text-slate-500">
                                <span className="font-medium">{answer.answeredBy?.name || "Anonymous"}</span>
                                <span>•</span>
                                <span>{formatTimestamp(answer.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Helpful Button */}
                          <div className="flex gap-3 mt-3">
                            <button
                              onClick={() => handleReaction(answer._id, "like")}
                              className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-lg transition ${hasReaction(answer, "like") ? "bg-green-600/30 text-green-300 border border-green-600/50" : "bg-slate-600/30 text-slate-400 hover:bg-slate-600/50 border border-slate-600/30"}`}
                            >
                              👍 ({answer.likedBy?.length || 0})
                            </button>
                            <button
                              onClick={() => handleReaction(answer._id, "dislike")}
                              className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-lg transition ${hasReaction(answer, "dislike") ? "bg-red-600/30 text-red-300 border border-red-600/50" : "bg-slate-600/30 text-slate-400 hover:bg-slate-600/50 border border-slate-600/30"}`}
                            >
                              👎 ({answer.dislikedBy?.length || 0})
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500">No answers yet. Be the first to answer!</div>
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

export default QnA;
