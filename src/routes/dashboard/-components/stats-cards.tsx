import { Link } from "@tanstack/react-router";
import { useStatsQuery } from "../-hooks/use-stats-query";

export function StatsCards() {
	const { data: stats } = useStatsQuery();

	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-5">
			<StatCard
				color="bg-primary"
				label="Articles"
				to="/articles"
				value={stats?.totalArticles ?? 0}
			/>
			<StatCard
				color="bg-secondary"
				label="Users"
				to="/users"
				value={stats?.totalUsers ?? 0}
			/>
			<StatCard
				color="bg-accent"
				label="Categories"
				to="/categories"
				value={stats?.totalCategories ?? 0}
			/>
			<StatCard
				color="bg-[#FFDE00]"
				label="Tags"
				to="/tags"
				value={stats?.totalTags ?? 0} // Explicit yellow if secondary is different or reuse secondary
			/>
			<StatCard
				color="bg-[#FF7169]"
				label="Comments"
				to="/comments"
				value={stats?.totalComments ?? 0} // Red/Pinkish
			/>
		</div>
	);
}

function StatCard({
	to,
	label,
	value,
	color,
}: {
	to: string;
	label: string;
	value: number;
	color: string;
}) {
	return (
		<Link
			className={`${color} hover:-translate-y-1 group flex h-32 flex-col justify-between rounded-sm border-2 border-foreground p-4 transition-all duration-200 hover:shadow-[4px_4px_0px_0px_var(--foreground)]`}
			to={to}
		>
			<div className="mb-2 border-foreground/20 border-b-2 pb-1 font-bold font-mono text-xs uppercase tracking-widest transition-colors group-hover:border-foreground/50">
				{label}
			</div>
			<div className="font-bold font-mono text-4xl text-foreground">
				{value}
			</div>
		</Link>
	);
}
