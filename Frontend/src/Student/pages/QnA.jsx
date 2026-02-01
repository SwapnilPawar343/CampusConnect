import React, { useState } from "react";
import Navbar from "../components/Navbar";

const QnA = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "How to prepare for placements?",
      description: "I'm in my third year and want to start preparing for campus placements. What should I focus on?",
      category: "Placements",
      author: "John Doe",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      replies: [
        {
          id: 101,
          text: "Focus on DSA, practice on LeetCode, and work on projects.",
          author: "Alumni Sarah",
          likes: 5,
          timestamp: new Date(Date.now() - 43200000).toISOString()
        }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAskPanel, setShowAskPanel] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: ""
  });
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyBox, setShowReplyBox] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;

    setQuestions([
      {
        id: Date.now(),
        ...form,
        author: "Current User",
        timestamp: new Date().toISOString(),
        replies: []
      },
      ...questions
    ]);

    setForm({ title: "", description: "", category: "" });
    setShowAskPanel(false);
  };

  const handleAddReply = (questionId) => {
    const replyText = replyInputs[questionId];
    if (!replyText || !replyText.trim()) return;

    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          replies: [
            ...q.replies,
            {
              id: Date.now(),
              text: replyText,
              author: "Current User",
              likes: 0,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return q;
    }));

    setReplyInputs({ ...replyInputs, [questionId]: "" });
    setShowReplyBox({ ...showReplyBox, [questionId]: false });
  };

  const handleLikeReply = (questionId, replyId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          replies: q.replies.map(r => {
            if (r.id === replyId) {
              return { ...r, likes: (r.likes || 0) + 1 };
            }
            return r;
          })
        };
      }
      return q;
    }));
  };

  const handleUnlikeReply = (questionId, replyId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          replies: q.replies.map(r => {
            if (r.id === replyId) {
              return { ...r, likes: Math.max((r.likes || 0) - 1, 0) };
            }
            return r;
          })
        };
      }
      return q;
    }));
  };

  const filteredQuestions = questions.filter(q =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.category.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Q&A Forum</h1>

      {/* Search Bar and Ask Question Button */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search questions..."
          className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => setShowAskPanel(!showAskPanel)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition whitespace-nowrap"
        >
          {showAskPanel ? "Cancel" : "Ask Question"}
        </button>
      </div>

      {/* Ask Question Panel - Toggleable */}
      {showAskPanel && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow mb-8 space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-800">Ask a Question</h2>
          
          <input
            type="text"
            placeholder="Question Title"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            placeholder="Describe your question in detail..."
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows="4"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Category (e.g., Placements, Career, Tech)"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <button 
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Submit Question
          </button>
        </form>
      )}

      {/* Question Feed */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            {searchQuery ? "No questions found matching your search." : "No questions yet. Be the first to ask!"}
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div key={q.id} className="bg-white p-6 rounded-lg shadow">
              {/* Question Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{q.title}</h3>
                  <div className="flex gap-3 mt-1 text-sm text-gray-500">
                    <span>by {q.author}</span>
                    <span>•</span>
                    <span>{formatTimestamp(q.timestamp)}</span>
                    {q.category && (
                      <>
                        <span>•</span>
                        <span className="text-indigo-600 font-medium">{q.category}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Question Description */}
              <p className="text-gray-700 mb-4">{q.description}</p>

              {/* Replies Section */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-700">
                    {q.replies.length} {q.replies.length === 1 ? "Reply" : "Replies"}
                  </h4>
                  <button
                    onClick={() => setShowReplyBox({ ...showReplyBox, [q.id]: !showReplyBox[q.id] })}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    {showReplyBox[q.id] ? "Cancel" : "Add Reply"}
                  </button>
                </div>

                {/* Reply Input Box */}
                {showReplyBox[q.id] && (
                  <div className="mb-4 flex gap-2">
                    <input
                      type="text"
                      placeholder="Write your reply..."
                      className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      value={replyInputs[q.id] || ""}
                      onChange={(e) => setReplyInputs({ ...replyInputs, [q.id]: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddReply(q.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAddReply(q.id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                      Post
                    </button>
                  </div>
                )}

                {/* Replies List */}
                {q.replies.length > 0 && (
                  <div className="space-y-3">
                    {q.replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="text-gray-800">{reply.text}</p>
                            <div className="flex gap-2 mt-1 text-xs text-gray-500">
                              <span className="font-medium">{reply.author}</span>
                              <span>•</span>
                              <span>{formatTimestamp(reply.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Like/Unlike Buttons */}
                        <div className="flex gap-3 mt-2">
                          <button
                            onClick={() => handleLikeReply(q.id, reply.id)}
                            className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            👍 Like ({reply.likes || 0})
                          </button>
                          <button
                            onClick={() => handleUnlikeReply(q.id, reply.id)}
                            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            👎 Unlike
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QnA;
