import { useUserArticlesQuery } from "../../-hooks/use-user-articles-query";

type UserStatsCardsProps = {
	userId: number;
};

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
				color="bg-primary/20"
				label="Total"
				value={articles?.length ?? 0}
			/>
			<StatBox
				color="bg-secondary/40"
				label="Published"
				value={publishedArticles.length}
			/>
			<StatBox
				color="bg-accent/30"
				label="Drafts"
				value={draftArticles.length}
			/>
			<StatBox
				color="bg-muted"
				label="Archived"
				value={archivedArticles.length}
			/>
		</div>
	);
}

function StatBox({
	label,
	value,
	color,
}: {
	label: string;
	value: number;
	color: string;
}) {
	return (
		<div
			className={`${color} hover:-translate-y-1 rounded-sm border-2 border-foreground p-4 text-center transition-transform`}
		>
			<div className="mb-1 font-bold font-mono text-4xl text-foreground">
				{value}
			</div>
			<div className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
				{label}
			</div>
		</div>
	);
}
