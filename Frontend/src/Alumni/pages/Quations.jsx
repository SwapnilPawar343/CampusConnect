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
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Questions</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search questions..."
          className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            {searchQuery ? "No questions found matching your search." : "No questions available right now."}
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div key={q._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{q.title}</h3>
                  <div className="flex gap-3 mt-1 text-sm text-gray-500">
                    <span>by {q.askedBy?.name || "Student"}</span>
                    <span>•</span>
                    <span>{formatTimestamp(q.createdAt)}</span>
                  </div>
                </div>
                {hasAnsweredQuestion(q) && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Answered
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-4">{q.description}</p>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-700">
                    {q.answers?.length || 0} {(q.answers?.length || 0) === 1 ? "Answer" : "Answers"}
                  </h4>
                  <button
                    onClick={() => setOpenAnswerBox((current) => ({ ...current, [q._id]: !current[q._id] }))}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
                    disabled={hasAnsweredQuestion(q)}
                  >
                    {openAnswerBox[q._id] ? "Cancel" : hasAnsweredQuestion(q) ? "Already Answered" : "Add Answer"}
                  </button>
                </div>

                {openAnswerBox[q._id] && !hasAnsweredQuestion(q) && (
                  <div className="mb-4 space-y-3">
                    <textarea
                      placeholder="Write your answer..."
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      rows="4"
                      value={answerInputs[q._id] || ""}
                      onChange={(e) => setAnswerInputs((current) => ({ ...current, [q._id]: e.target.value }))}
                    />
                    <button
                      onClick={() => handleSubmitAnswer(q._id)}
                      disabled={submittingId === q._id}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
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
  );
};

export default Quations;
