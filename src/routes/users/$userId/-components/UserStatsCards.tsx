import { useUserArticlesQuery } from "../../-hooks/useUserArticlesQuery";

interface UserStatsCardsProps {
	userId: number;
}

export function UserStatsCards({ userId }: UserStatsCardsProps) {
	const { data: articles } = useUserArticlesQuery(userId);

	const publishedArticles =
		articles?.filter((a) => a.status === "published") ?? [];
	const draftArticles = articles?.filter((a) => a.status === "draft") ?? [];
	const archivedArticles =
		articles?.filter((a) => a.status === "archived") ?? [];

	return (
		<div className="grid grid-cols-4 gap-4">
			<StatBox
				label="Total"
				value={articles?.length ?? 0}
				color="bg-primary/20"
			/>
			<StatBox
				label="Published"
				value={publishedArticles.length}
				color="bg-secondary/40"
			/>
			<StatBox
				label="Drafts"
				value={draftArticles.length}
				color="bg-accent/30"
			/>
			<StatBox
				label="Archived"
				value={archivedArticles.length}
				color="bg-muted"
			/>
		</div>
	);
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
	return (
		<div className={`${color} border-2 border-foreground rounded-sm p-4 text-center hover:-translate-y-1 transition-transform`}>
			<div className="text-4xl font-bold font-mono text-foreground mb-1">{value}</div>
			<div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</div>
		</div>
	);
}
