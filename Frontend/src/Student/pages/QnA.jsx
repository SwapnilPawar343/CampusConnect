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
        <form className="bg-white p-6 rounded-lg shadow mb-8 space-y-4" onSubmit={handleAskQuestion}>
          <h2 className="text-xl font-semibold text-gray-800">Ask a Question</h2>
          
          <input
            type="text"
            placeholder="Question Title"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />

          <textarea
            placeholder="Describe your question in detail..."
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows="4"
            
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
            <div key={q._id} className="bg-white p-6 rounded-lg shadow">
              {/* Question Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{q.title}</h3>
                  <div className="flex gap-3 mt-1 text-sm text-gray-500">
                    <span>by {q.askedBy?.name || "Anonymous"}</span>
                    <span>•</span>
                    <span>{formatTimestamp(q.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Question Description */}
              <p className="text-gray-700 mb-4">{q.description}</p>

              {/* Answers Section */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-gray-700 mb-3">
                  {q.answers?.length || 0} {(q.answers?.length || 0) === 1 ? "Answer" : "Answers"}
                </h4>

                {/* Answers List */}
                {q.answers && q.answers.length > 0 ? (
                  <div className="space-y-3">
                    {q.answers.map((answer) => (
                      <div key={answer._id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="text-gray-800">{answer.content || answer.text || answer.description || "No answer content"}</p>
                            <div className="flex gap-2 mt-1 text-xs text-gray-500">
                              <span className="font-medium">{answer.answeredBy?.name || "Anonymous"}</span>
                              <span>•</span>
                              <span>{formatTimestamp(answer.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Helpful Button */}
                        <div className="flex gap-3 mt-2">
                          <button
                            onClick={() => handleReaction(answer._id, "like")}
                              className={`flex items-center gap-1 text-sm font-medium ${hasReaction(answer, "like") ? "text-green-700" : "text-green-600 hover:text-green-700"}`}
                          >
                            👍 Like ({answer.likedBy?.length || 0})
                          </button>
                          <button
                            onClick={() => handleReaction(answer._id, "dislike")}
                              className={`flex items-center gap-1 text-sm font-medium ${hasReaction(answer, "dislike") ? "text-red-700" : "text-red-600 hover:text-red-700"}`}
                          >
                            👎 Dislike ({answer.dislikedBy?.length || 0})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No answers yet.</div>
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
