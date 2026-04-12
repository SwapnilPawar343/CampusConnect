import React, { useContext, useEffect, useState } from "react";
import { studentContext } from "../../context/studentContext";

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
	const { getToken } = useContext(studentContext);
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
					Authorization: `Bearer ${getToken()}`,
				}
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
	}, [backendUrl, getToken]);

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
		<div className="min-h-screen bg-linear-to-br from-purple-950 via-purple-900 to-indigo-950 p-4 md:p-6">
			<h1 className="text-3xl font-bold text-white mb-2">My Answers</h1>
			<p className="text-purple-200 mb-6">Answers you have posted for students.</p>

			<div className="bg-linear-to-br from-slate-900/80 to-slate-950/80 border border-pink-500/30 p-4 rounded-2xl shadow mb-6 backdrop-blur-xl">
				<input
					type="text"
					placeholder="Search your answers..."
					className="w-full border border-pink-500/30 bg-slate-800/60 text-white placeholder-purple-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pink-400/30 focus:outline-none"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			{loading ? (
				<div className="bg-linear-to-br from-slate-900/80 to-slate-950/80 border border-pink-500/30 p-8 rounded-2xl shadow text-center text-purple-300 backdrop-blur-xl">
					Loading your answers...
				</div>
			) : filteredAnswers.length === 0 ? (
				<div className="bg-linear-to-br from-slate-900/80 to-slate-950/80 border border-pink-500/30 p-8 rounded-2xl shadow text-center text-purple-300 backdrop-blur-xl">
					{searchQuery ? "No answers found matching your search." : "You have not answered any questions yet."}
				</div>
			) : (
				<div className="space-y-4">
					{filteredAnswers.map((item) => (
						<div key={item._id} className="bg-linear-to-br from-slate-900/80 to-slate-950/80 rounded-2xl shadow p-6 border border-pink-500/30 backdrop-blur-xl">
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="text-sm font-semibold text-pink-300 mb-1">Question</p>
									<h2 className="text-xl font-semibold text-white">{item.quation?.title || "Untitled question"}</h2>
									<p className="text-sm text-purple-300 mt-1">
										Asked by {item.quation?.askedBy?.name || "Student"} • {formatTimestamp(item.quation?.createdAt)}
									</p>
								</div>
								<span className="rounded-full bg-pink-500/15 px-3 py-1 text-sm font-medium text-pink-200 border border-pink-500/20">
									{formatTimestamp(item.createdAt)}
								</span>
							</div>

							{item.quation?.description && (
								<p className="mt-3 rounded-lg bg-slate-800/50 p-4 text-purple-100 border border-pink-500/20">{item.quation.description}</p>
							)}

							<div className="mt-4 border-t pt-4">
								<p className="text-sm font-semibold text-emerald-300 mb-2">Your Answer</p>
								<p className="text-purple-100 leading-7">{item.content}</p>
								<div className="mt-4 flex flex-wrap gap-3 text-sm">
									<span className="rounded-full bg-green-500/15 px-3 py-2 font-medium text-green-300 border border-green-400/20">
										👍 Likes {item.likedBy?.length || 0}
									</span>
									<span className="rounded-full bg-red-500/15 px-3 py-2 font-medium text-red-300 border border-red-400/20">
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
