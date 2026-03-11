import React, { useEffect, useState } from "react";

const formatTimestamp = (timestamp) => {
	const date = new Date(timestamp);
	const now = new Date();
	const diffMs = now - date;
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 60) return `${Math.max(diffMins, 1)}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	return `${diffDays}d ago`;
};

const MyAnswers = () => {
	const [answers, setAnswers] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

	useEffect(() => {
		const fetchMyAnswers = async () => {
			try {
				setLoading(true);
				const response = await fetch(`${backendUrl}/api/questions/myanswers`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						"Content-Type": "application/json",
					},
				});

				const data = await response.json();
				if (response.ok) {
					setAnswers(Array.isArray(data) ? data : []);
				} else {
					alert(data.message || "Failed to fetch your answers");
				}
			} catch (error) {
				console.error("Error fetching answers:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchMyAnswers();
	}, [backendUrl]);

	const filteredAnswers = answers.filter((item) => {
		const questionTitle = item.quation?.title || "";
		const questionDescription = item.quation?.description || "";
		const answerContent = item.content || "";

		return (
			questionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
			questionDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
			answerContent.toLowerCase().includes(searchQuery.toLowerCase())
		);
	});

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<h1 className="text-3xl font-bold text-gray-800 mb-6">My Answers</h1>

			<div className="bg-white p-4 rounded-lg shadow mb-6">
				<input
					type="text"
					placeholder="Search your answers..."
					className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			{loading ? (
				<div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
					Loading your answers...
				</div>
			) : filteredAnswers.length === 0 ? (
				<div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
					{searchQuery ? "No answers found matching your search." : "You have not answered any questions yet."}
				</div>
			) : (
				<div className="space-y-4">
					{filteredAnswers.map((item) => (
						<div key={item._id} className="bg-white rounded-lg shadow p-6">
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="text-sm font-semibold text-indigo-600 mb-1">Question</p>
									<h2 className="text-xl font-semibold text-gray-800">{item.quation?.title || "Untitled question"}</h2>
									<p className="text-sm text-gray-500 mt-1">
										Asked by {item.quation?.askedBy?.name || "Student"} • {formatTimestamp(item.quation?.createdAt)}
									</p>
								</div>
								<span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
									{formatTimestamp(item.createdAt)}
								</span>
							</div>

							{item.quation?.description && (
								<p className="mt-3 rounded-lg bg-gray-50 p-4 text-gray-600">{item.quation.description}</p>
							)}

							<div className="mt-4 border-t pt-4">
								<p className="text-sm font-semibold text-emerald-700 mb-2">Your Answer</p>
								<p className="text-gray-800 leading-7">{item.content}</p>
								<div className="mt-4 flex flex-wrap gap-3 text-sm">
									<span className="rounded-full bg-green-50 px-3 py-2 font-medium text-green-700">
										👍 Likes {item.likedBy?.length || 0}
									</span>
									<span className="rounded-full bg-red-50 px-3 py-2 font-medium text-red-700">
										👎 Dislikes {item.dislikedBy?.length || 0}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default MyAnswers;
