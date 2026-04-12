import { useMemo, useState, useEffect } from "react";

const seedAlumni = [
	{
		id: "alumni-1",
		name: "Aarav Mehta",
		company: "Google",
		role: "Frontend Engineer",
		answers: 28,
		likes: 142,
		dislikes: 6,
		skills: ["React", "TypeScript", "CSS", "Next.js", "GraphQL"],
	},
	{
		id: "alumni-2",
		name: "Sara Khan",
		company: "Microsoft",
		role: "Product Designer",
		answers: 31,
		likes: 126,
		dislikes: 4,
		skills: ["Figma", "UI/UX", "Prototyping", "Research", "Design Systems"],
	},
	{
		id: "alumni-3",
		name: "Rohit Sharma",
		company: "Amazon",
		role: "Backend Engineer",
		answers: 18,
		likes: 93,
		dislikes: 8,
		skills: ["Node.js", "MongoDB", "AWS", "System Design", "Express"],
	},
	{
		id: "alumni-4",
		name: "Neha Patel",
		company: "Infosys",
		role: "Data Analyst",
		answers: 22,
		likes: 84,
		dislikes: 3,
		skills: ["Python", "SQL", "Power BI", "Excel", "Statistics"],
	},
	{
		id: "alumni-5",
		name: "Vikram Iyer",
		company: "TCS",
		role: "DevOps Engineer",
		answers: 26,
		likes: 101,
		dislikes: 7,
		skills: ["Docker", "Kubernetes", "Linux", "CI/CD", "AWS"],
	},
	{
		id: "alumni-6",
		name: "Priya Nair",
		company: "Accenture",
		role: "Full Stack Developer",
		answers: 16,
		likes: 71,
		dislikes: 2,
		skills: ["React", "Node.js", "MongoDB", "Tailwind", "REST APIs"],
	},
];

const seedStudents = [
	{
		id: "student-1",
		name: "Karan Joshi",
		company: "Campus Learner",
		role: "CSE Student",
		answers: 6,
		likes: 18,
		dislikes: 1,
		skills: ["React", "JavaScript", "CSS", "Git", "Problem Solving"],
	},
	{
		id: "student-2",
		name: "Ananya Singh",
		company: "Campus Learner",
		role: "IT Student",
		answers: 4,
		likes: 12,
		dislikes: 0,
		skills: ["Python", "SQL", "Excel", "Communication", "Data Analysis"],
	},
	{
		id: "student-3",
		name: "Dev Arora",
		company: "Campus Learner",
		role: "ECE Student",
		answers: 5,
		likes: 15,
		dislikes: 2,
		skills: ["C++", "DSA", "Electronics", "Java", "Linux"],
	},
];

const fallbackPoster = "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80";

const audienceLabels = {
	all: "All Dashboards",
	alumni: "Alumni Dashboard",
	student: "Student Dashboard",
	both: "Alumni + Student",
};

const audienceOptions = [
	{ value: "both", label: "Both" },
	{ value: "alumni", label: "Alumni only" },
	{ value: "student", label: "Student only" },
];

const formatNumber = (value) => new Intl.NumberFormat().format(value);

const groupByCount = (items, keyGetter) => {
	const counts = new Map();

	items.forEach((item) => {
		const key = keyGetter(item);
		if (!key) return;
		counts.set(key, (counts.get(key) || 0) + 1);
	});

	return Array.from(counts.entries())
		.map(([label, count]) => ({ label, count }))
		.sort((left, right) => right.count - left.count);
};

const buildSkillStats = (items) => {
	const counts = new Map();

	items.forEach((person) => {
		(person.skills || []).forEach((skill) => {
			const key = skill.trim();
			if (!key) return;
			counts.set(key, (counts.get(key) || 0) + 1);
		});
	});

	return Array.from(counts.entries())
		.map(([label, count]) => ({ label, count }))
		.sort((left, right) => right.count - left.count)
		.slice(0, 5);
};

const AdminDashboard = () => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
	const [audienceView, setAudienceView] = useState("all");
	const [events, setEvents] = useState([]);
	const [eventLoading, setEventLoading] = useState(false);
	const [showEventForm, setShowEventForm] = useState(false);
	const [posterPreview, setPosterPreview] = useState("");
	const [eventForm, setEventForm] = useState({
		name: "",
		description: "",
		date: "",
		audience: "both",
		posterFile: null,
	});

	useEffect(() => {
		const fetchEvents = async () => {
			setEventLoading(true);
			try {
				const response = await fetch(`${backendUrl}/api/events`);
				const data = await response.json();
				if (response.ok) {
					setEvents(Array.isArray(data) ? data : []);
				}
			} catch (error) {
				console.error("Failed to fetch events:", error);
			} finally {
				setEventLoading(false);
			}
		};

		fetchEvents();
	}, [backendUrl]);

	const dashboardPeople = useMemo(() => {
		if (audienceView === "alumni") return seedAlumni;
		if (audienceView === "student") return seedStudents;
		return [...seedAlumni, ...seedStudents];
	}, [audienceView]);

	const skillStats = useMemo(() => buildSkillStats(dashboardPeople), [dashboardPeople]);

	const companyStats = useMemo(() => {
		const alumniCompanies = groupByCount(seedAlumni, (person) => person.company);
		return alumniCompanies.slice(0, 5);
	}, []);

	const activeAlumniRanking = useMemo(() => {
		return seedAlumni
			.map((person) => ({
				...person,
				score: person.answers + person.likes - person.dislikes,
			}))
			.sort((left, right) => right.score - left.score)
			.map((person, index) => ({ ...person, rank: index + 1 }));
	}, []);

	const visibleEvents = [...events]
		.filter((event) => {
			if (audienceView === "all") return true;
			if (event.audience === "both") return true;
			return event.audience === audienceView;
		})
		.sort((left, right) => new Date(left.date) - new Date(right.date));

	const alumniPreviewEvents = useMemo(
		() => events.filter((event) => event.audience === "alumni" || event.audience === "both").sort((left, right) => new Date(left.date) - new Date(right.date)),
		[events]
	);

	const studentPreviewEvents = useMemo(
		() => events.filter((event) => event.audience === "student" || event.audience === "both").sort((left, right) => new Date(left.date) - new Date(right.date)),
		[events]
	);

	const totals = {
		alumni: seedAlumni.length,
		students: seedStudents.length,
		companies: companyStats.length,
		events: events.length,
	};

	const handlePosterChange = (file) => {
		if (!file) {
			setPosterPreview("");
			setEventForm((current) => ({ ...current, posterFile: null }));
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			setPosterPreview(String(reader.result || ""));
			setEventForm((current) => ({ ...current, posterFile: file }));
		};
		reader.readAsDataURL(file);
	};

	const handleCreateEvent = async (event) => {
		event.preventDefault();

		if (!eventForm.name.trim() || !eventForm.description.trim() || !eventForm.date) {
			alert("Please fill event name, description, and date.");
			return;
		}

		try {
			const response = await fetch(`${backendUrl}/api/events`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: eventForm.name.trim(),
					description: eventForm.description.trim(),
					poster: posterPreview || fallbackPoster,
					date: eventForm.date,
					audience: eventForm.audience,
				}),
			});

			const data = await response.json();
			if (!response.ok) {
				alert(data.message || "Failed to publish event.");
				return;
			}

			setEvents((current) => [data.event, ...current]);
			setEventForm({ name: "", description: "", date: "", audience: "both", posterFile: null });
			setPosterPreview("");
			setShowEventForm(false);
		} catch (error) {
			console.error("Failed to publish event:", error);
			alert("Failed to publish event.");
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950 to-indigo-950 text-white">
			<div className="border-b border-pink-500/20 bg-slate-950/70 backdrop-blur-xl">
				<div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8">
					<div>
						<p className="text-sm uppercase tracking-[0.28em] text-pink-300/70">Admin Control Center</p>
						<h1 className="mt-2 text-3xl font-black md:text-4xl">Alumni and Student Dashboard</h1>
						<p className="mt-2 max-w-2xl text-sm text-purple-200">
							Monitor alumni engagement, track top skills, rank active alumni, and publish events by audience.
						</p>
					</div>

					<div className="flex flex-wrap gap-3">
						<button
							onClick={() => setAudienceView("all")}
							className={`rounded-full px-4 py-2 text-sm font-semibold transition ${audienceView === "all" ? "bg-pink-500 text-white" : "bg-white/10 text-purple-100 hover:bg-white/15"}`}
						>
							All
						</button>
						<button
							onClick={() => setAudienceView("alumni")}
							className={`rounded-full px-4 py-2 text-sm font-semibold transition ${audienceView === "alumni" ? "bg-pink-500 text-white" : "bg-white/10 text-purple-100 hover:bg-white/15"}`}
						>
							Alumni
						</button>
						<button
							onClick={() => setAudienceView("student")}
							className={`rounded-full px-4 py-2 text-sm font-semibold transition ${audienceView === "student" ? "bg-pink-500 text-white" : "bg-white/10 text-purple-100 hover:bg-white/15"}`}
						>
							Student
						</button>
					</div>
				</div>
			</div>

			<main className="mx-auto max-w-7xl space-y-8 px-4 py-6 md:px-8 md:py-8">
				<section className="grid gap-4 md:grid-cols-4">
					<StatCard label="Alumni" value={totals.alumni} note="Tracked profiles" />
					<StatCard label="Students" value={totals.students} note="Active learners" />
					<StatCard label="Companies" value={totals.companies} note="Alumni workplaces" />
					<StatCard label="Events" value={totals.events} note="Published announcements" />
				</section>

				<section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
					<CardShell title={`Top 5 Skills - ${audienceLabels[audienceView]}`} subtitle="Bars update when you switch between alumni, student, or all data.">
						<div className="space-y-4">
							{skillStats.length > 0 ? skillStats.map((skill) => (
								<SkillBar key={skill.label} label={skill.label} value={skill.count} max={skillStats[0]?.count || 1} />
							)) : (
								<p className="text-sm text-purple-300">No skill data available.</p>
							)}
						</div>
					</CardShell>

					<CardShell title="Top Companies" subtitle="Where alumni are working most often.">
						<div className="space-y-3">
							{companyStats.map((company) => (
								<div key={company.label} className="rounded-2xl border border-pink-500/15 bg-slate-900/60 px-4 py-3">
									<div className="flex items-center justify-between gap-4">
										<div>
											<p className="font-semibold text-white">{company.label}</p>
											<p className="text-xs text-purple-300">Alumni count</p>
										</div>
										<span className="rounded-full bg-pink-500/15 px-3 py-1 text-sm font-semibold text-pink-200">{company.count}</span>
									</div>
								</div>
							))}
						</div>
					</CardShell>
				</section>

				<section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
					<CardShell title="Most Active Alumni" subtitle="Score = answers + likes - dislikes.">
						<div className="space-y-3">
							{activeAlumniRanking.map((person) => (
								<div key={person.id} className="rounded-2xl border border-pink-500/15 bg-slate-900/60 p-4">
									<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
										<div>
											<div className="flex items-center gap-3">
												<span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-r from-pink-600 to-purple-600 text-sm font-bold text-white">{person.rank}</span>
												<div>
													<p className="text-lg font-bold text-white">{person.name}</p>
													<p className="text-sm text-purple-300">{person.role} · {person.company}</p>
												</div>
											</div>
										</div>
										<div className="grid grid-cols-3 gap-2 text-center text-xs md:min-w-60">
											<MetricPill label="Answers" value={person.answers} tone="violet" />
											<MetricPill label="Likes" value={person.likes} tone="green" />
											<MetricPill label="Dislikes" value={person.dislikes} tone="red" />
										</div>
									</div>
									<div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
										<span className="text-sm text-purple-200">Net activity score</span>
										<span className="text-lg font-black text-pink-300">{person.score}</span>
									</div>
								</div>
							))}
						</div>
					</CardShell>

					<CardShell title="Create Event" subtitle="Publish events for alumni, students, or both audiences.">
						<div className="space-y-4">
							<button
								onClick={() => setShowEventForm((current) => !current)}
								className="w-full rounded-2xl bg-linear-to-r from-pink-600 to-purple-600 px-4 py-3 text-sm font-bold text-white transition hover:from-pink-700 hover:to-purple-700"
							>
								{showEventForm ? "Close Event Form" : "Add Event"}
							</button>

							{showEventForm && (
								<form onSubmit={handleCreateEvent} className="space-y-4 rounded-3xl border border-pink-500/20 bg-slate-900/60 p-5 backdrop-blur-xl">
									<Field label="Event Name">
										<input
											value={eventForm.name}
											onChange={(event) => setEventForm((current) => ({ ...current, name: event.target.value }))}
											className="w-full rounded-xl border border-pink-500/20 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-purple-400 focus:border-pink-400"
											placeholder="Example: Annual Alumni Meetup"
										/>
									</Field>

									<Field label="Description">
										<textarea
											value={eventForm.description}
											onChange={(event) => setEventForm((current) => ({ ...current, description: event.target.value }))}
											className="min-h-28 w-full rounded-xl border border-pink-500/20 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-purple-400 focus:border-pink-400"
											placeholder="Short details about the event"
										/>
									</Field>

									<Field label="Poster">
										<input
											type="file"
											accept="image/*"
											onChange={(event) => handlePosterChange(event.target.files?.[0] || null)}
											className="w-full rounded-xl border border-pink-500/20 bg-slate-950/70 px-4 py-3 text-purple-200 file:mr-4 file:rounded-full file:border-0 file:bg-pink-500 file:px-4 file:py-2 file:text-white file:font-semibold"
										/>
									</Field>

									{posterPreview && (
										<img src={posterPreview} alt="Poster preview" className="h-40 w-full rounded-2xl object-cover" />
									)}

									<div className="grid gap-4 md:grid-cols-2">
										<Field label="Event Date">
											<input
												type="date"
												value={eventForm.date}
												onChange={(event) => setEventForm((current) => ({ ...current, date: event.target.value }))}
												className="w-full rounded-xl border border-pink-500/20 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-pink-400"
											/>
										</Field>

										<Field label="Audience">
											<select
												value={eventForm.audience}
												onChange={(event) => setEventForm((current) => ({ ...current, audience: event.target.value }))}
												className="w-full rounded-xl border border-pink-500/20 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-pink-400"
											>
												{audienceOptions.map((option) => (
													<option key={option.value} value={option.value}>{option.label}</option>
												))}
											</select>
										</Field>
									</div>

									<button type="submit" className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-pink-100">
										Publish Event
									</button>
								</form>
							)}
						</div>
					</CardShell>
				</section>

				<section className="grid gap-6 lg:grid-cols-2">
					<CardShell title={`Visible Events - ${audienceLabels[audienceView]}`} subtitle="Filtered by audience and sorted by event date.">
						<div className="space-y-4">
							{eventLoading ? (
								<p className="text-sm text-purple-300">Loading events...</p>
							) : visibleEvents.length > 0 ? visibleEvents.map((event) => (
								<EventCard key={event._id} event={event} />
							)) : (
								<p className="text-sm text-purple-300">No events match the selected audience.</p>
							)}
						</div>
					</CardShell>

					<CardShell title="Dashboard Visibility Preview" subtitle="Shows which dashboard sees each event.">
						<div className="space-y-4">
							<PreviewPanel title="Alumni Dashboard" events={alumniPreviewEvents} />
							<PreviewPanel title="Student Dashboard" events={studentPreviewEvents} />
						</div>
					</CardShell>
				</section>
			</main>
		</div>
	);
};

const StatCard = ({ label, value, note }) => (
	<div className="rounded-3xl border border-pink-500/20 bg-linear-to-br from-slate-900/80 to-slate-950/80 p-5 shadow-lg backdrop-blur-xl">
		<p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-300/80">{label}</p>
		<p className="mt-3 text-4xl font-black text-white">{formatNumber(value)}</p>
		<p className="mt-2 text-sm text-purple-300">{note}</p>
	</div>
);

const CardShell = ({ title, subtitle, children }) => (
	<div className="rounded-4xl border border-pink-500/20 bg-linear-to-br from-slate-900/80 to-slate-950/80 p-5 shadow-xl backdrop-blur-xl md:p-6">
		<div className="mb-5">
			<h2 className="text-xl font-bold text-white md:text-2xl">{title}</h2>
			<p className="mt-1 text-sm text-purple-300">{subtitle}</p>
		</div>
		{children}
	</div>
);

const SkillBar = ({ label, value, max }) => {
	const width = Math.max((value / max) * 100, 8);

	return (
		<div>
			<div className="mb-2 flex items-center justify-between text-sm">
				<span className="font-semibold text-white">{label}</span>
				<span className="text-purple-300">{value}</span>
			</div>
			<div className="h-3 overflow-hidden rounded-full bg-white/10">
				<div className="h-full rounded-full bg-linear-to-r from-pink-600 to-purple-600" style={{ width: `${width}%` }} />
			</div>
		</div>
	);
};

const MetricPill = ({ label, value, tone }) => {
	const toneClasses = {
		violet: "bg-violet-500/15 text-violet-200 border-violet-500/20",
		green: "bg-emerald-500/15 text-emerald-200 border-emerald-500/20",
		red: "bg-red-500/15 text-red-200 border-red-500/20",
	};

	return (
		<div className={`rounded-2xl border px-3 py-2 ${toneClasses[tone]}`}>
			<p className="text-[11px] uppercase tracking-[0.18em] opacity-80">{label}</p>
			<p className="mt-1 text-sm font-bold">{value}</p>
		</div>
	);
};

const Field = ({ label, children }) => (
	<label className="block space-y-2 text-sm font-medium text-purple-200">
		<span>{label}</span>
		{children}
	</label>
);

const EventCard = ({ event }) => (
	<article className="overflow-hidden rounded-3xl border border-pink-500/20 bg-slate-900/70">
		<img src={event.poster} alt={event.name} className="h-44 w-full object-cover" />
		<div className="space-y-3 p-4">
			<div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
				<span className="rounded-full bg-pink-500/15 px-3 py-1 text-pink-200">{audienceLabels[event.audience]}</span>
				<span className="rounded-full bg-white/10 px-3 py-1 text-purple-200">{new Date(event.date).toLocaleDateString()}</span>
			</div>
			<h3 className="text-lg font-bold text-white">{event.name}</h3>
			<p className="text-sm leading-6 text-purple-200">{event.description}</p>
		</div>
	</article>
);

const PreviewPanel = ({ title, events }) => (
	<div className="rounded-3xl border border-pink-500/15 bg-slate-950/70 p-4">
		<div className="mb-4 flex items-center justify-between">
			<h3 className="font-bold text-white">{title}</h3>
			<span className="rounded-full bg-pink-500/15 px-3 py-1 text-xs font-semibold text-pink-200">{events.length} events</span>
		</div>
		<div className="space-y-3">
			{events.length > 0 ? events.map((event) => (
				<div key={event._id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
					<div className="flex items-start justify-between gap-3">
						<div>
							<p className="font-semibold text-white">{event.name}</p>
							<p className="text-xs text-purple-300">{new Date(event.date).toLocaleDateString()}</p>
						</div>
						<span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-purple-200">
							{audienceLabels[event.audience]}
						</span>
					</div>
				</div>
			)) : (
				<p className="text-sm text-purple-300">No events available for this dashboard.</p>
			)}
		</div>
	</div>
);

export default AdminDashboard;
