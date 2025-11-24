import { createFileRoute } from "@tanstack/react-router";
import { CategoryDistributionCard } from "./-components/CategoryDistributionCard";
import { RecentArticlesCard } from "./-components/RecentArticlesCard";
import { StatsCards } from "./-components/StatsCards";
import { TopAuthorsCard } from "./-components/TopAuthorsCard";

export const Route = createFileRoute("/dashboard/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			<h1 className="text-3xl font-bold">数据面板</h1>
			<StatsCards />

			<div className="grid md:grid-cols-2 gap-6">
				<TopAuthorsCard />
				<CategoryDistributionCard />
			</div>

			<RecentArticlesCard />
		</div>
	);
}
