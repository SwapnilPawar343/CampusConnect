import React, { useState, useContext, useEffect } from "react";
import { studentContext } from "../../context/studentContext";
// import React, { useState } from "react";
// import Navbar from "../components/Navbar";

const MyQues = () => {
  const { question: allQuestions } = useContext(studentContext);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAskPanel, setShowAskPanel] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState({});

  // Get current user ID from localStorage
  useEffect(() => {
    const studentData = localStorage.getItem('student');
    if (studentData) {
      const student = JSON.parse(studentData);
      setCurrentUserId(student._id);
      console.log('Current user ID:', student._id);
    }
  }, []);

  // Filter questions asked by current user
  const myQuestions = currentUserId && Array.isArray(allQuestions) 
    ? allQuestions.filter(q => {
        console.log('Comparing:', q.askedBy?._id, 'with', currentUserId);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Questions</h1>
      
      {/* <Navbar /> */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search your questions..."
          className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Question Feed */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            {searchQuery ? "No questions found matching your search." : "You haven't asked any questions yet!"}
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div key={q._id} className="bg-white p-6 rounded-lg shadow">
              {/* Question Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{q.title}</h3>
                  <div className="flex gap-3 mt-1 text-sm text-gray-500">
                    <span>asked {formatTimestamp(q.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{q.answers?.length || 0} {(q.answers?.length || 0) === 1 ? "Answer" : "Answers"}</span>
                  <button
                    onClick={() => setShowReplyBox({ ...showReplyBox, [q._id]: !showReplyBox[q._id] })}
                    className="inline-flex items-center gap-2 text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    aria-expanded={!!showReplyBox[q._id]}
                  >
                    {showReplyBox[q._id] ? "Hide Answers" : "View Answers"}
                    <svg className={`w-4 h-4 transition-transform ${showReplyBox[q._id] ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Question Description */}
              <p className="text-gray-700 mb-4">{q.description}</p>

              {/* Answers Dropdown */}
              {showReplyBox[q._id] && (
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded p-4 shadow-sm">
                  {/* Answers List */}
                  {q.answers && q.answers.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-auto">
                      {q.answers.map((answer) => (
                        <div key={answer._id} className="bg-white p-4 rounded-lg border">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="text-gray-800">{answer.text || answer.description}</p>
                              <div className="flex gap-2 mt-1 text-xs text-gray-500">
                                <span className="font-medium">{answer.answeredBy?.name || "Anonymous"}</span>
                                <span>•</span>
                                <span>{formatTimestamp(answer.createdAt)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Helpful Button */}
                          <div className="flex gap-3 mt-2">
                            <button className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium">
                              👍 Helpful ({answer.helpful || 0})
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No answers yet. Check back later!</div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyQues;
