import React, { useState } from "react";

const QnA = () => {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;

    setQuestions([
      {
        id: Date.now(),
        ...form,
        votes: 0,
        bestAnswer: "Focus on DSA + projects. Start early!",
      },
      ...questions
    ]);

    setForm({ title: "", description: "", category: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Q&A Forum</h1>

      {/* Ask Question Panel */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow mb-8 space-y-4"
      >
        <input
          type="text"
          placeholder="Question Title"
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Describe your question"
          className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          rows="3"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="text"
          placeholder="Category (Placements, Career, Tech)"
          className="w-full border rounded-lg px-4 py-2"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
          Submit Question
        </button>
      </form>

      {/* Question Feed */}
      {questions.map((q) => (
        <div key={q.id} className="bg-white p-5 rounded-lg shadow mb-4">
          <h3 className="text-xl font-semibold">{q.title}</h3>
          <p className="text-gray-600 mt-2">{q.description}</p>

          <span className="text-sm text-indigo-500">
            Category: {q.category}
          </span>

          {/* Best Answer */}
          <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500">
            ⭐ <strong>Best Answer:</strong> {q.bestAnswer}
          </div>

          {/* Upvote */}
          <button
            className="mt-3 text-sm text-indigo-600 font-medium"
            onClick={() => q.votes++}
          >
            👍 Upvote ({q.votes})
          </button>
        </div>
      ))}
    </div>
  );
};

export default QnA;
