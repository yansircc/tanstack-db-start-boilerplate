import { createFileRoute } from "@tanstack/react-router";
import { CategoryDistributionCard } from "./-components/CategoryDistributionCard";
import { RecentArticlesCard } from "./-components/RecentArticlesCard";
import { StatsCards } from "./-components/StatsCards";
import { TopAuthorsCard } from "./-components/TopAuthorsCard";
import { useCategoryStatsQuery } from "./-hooks/useCategoryStatsQuery";
import { useRecentArticlesQuery } from "./-hooks/useRecentArticlesQuery";
import { useStatsQuery } from "./-hooks/useStatsQuery";
import { useTopAuthorsQuery } from "./-hooks/useTopAuthorsQuery";

export const Route = createFileRoute("/dashboard/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { data: stats } = useStatsQuery();
	const { data: topAuthors } = useTopAuthorsQuery();
	const { data: recentArticles } = useRecentArticlesQuery();
	const { data: categoryStats } = useCategoryStatsQuery();

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			<h1 className="text-3xl font-bold">数据面板</h1>

			<StatsCards stats={stats?.[0]} />

			<div className="grid md:grid-cols-2 gap-6">
				<TopAuthorsCard authors={topAuthors} />
				<CategoryDistributionCard categories={categoryStats} />
			</div>

			<RecentArticlesCard articles={recentArticles} />
		</div>
	);
}
