import { Link } from "@tanstack/react-router";
import { useStatsQuery } from "../-hooks/useStatsQuery";

export function StatsCards() {
	const { data: stats } = useStatsQuery();

	return (
		<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
			<StatCard
				to="/articles"
				label="Articles"
				value={stats?.totalArticles ?? 0}
				color="bg-primary"
			/>
			<StatCard
				to="/users"
				label="Users"
				value={stats?.totalUsers ?? 0}
				color="bg-secondary"
			/>
			<StatCard
				to="/categories"
				label="Categories"
				value={stats?.totalCategories ?? 0}
				color="bg-accent"
			/>
			<StatCard
				to="/tags"
				label="Tags"
				value={stats?.totalTags ?? 0}
				color="bg-[#FFDE00]" // Explicit yellow if secondary is different or reuse secondary
			/>
			<StatCard
				to="/comments"
				label="Comments"
				value={stats?.totalComments ?? 0}
				color="bg-[#FF7169]" // Red/Pinkish
			/>
		</div>
	);
}

function StatCard({
	to,
	label,
	value,
	color,
}: { to: string; label: string; value: number; color: string }) {
	return (
		<Link
			to={to}
			className={`${color} border-2 border-foreground rounded-sm p-4 flex flex-col justify-between h-32 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--foreground)] transition-all duration-200 group`}
		>
			<div className="text-xs font-mono font-bold uppercase tracking-widest border-b-2 border-foreground/20 pb-1 mb-2 group-hover:border-foreground/50 transition-colors">
				{label}
			</div>
			<div className="text-4xl font-mono font-bold text-foreground">
				{value}
			</div>
		</Link>
	);
}
