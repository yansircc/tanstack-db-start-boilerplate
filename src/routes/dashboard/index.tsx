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
			<div className="relative" style={{ paddingTop: "56.25%" }}>
				<iframe
					title="Cloudflare Stream"
					src="https://customer-24tu66vbqy31f87j.cloudflarestream.com/03e1594a33bd8f9532f36d309624d8ea/iframe?poster=https%3A%2F%2Fcustomer-24tu66vbqy31f87j.cloudflarestream.com%2F03e1594a33bd8f9532f36d309624d8ea%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600"
					loading="lazy"
					style={{
						border: "none",
						position: "absolute",
						top: 0,
						left: 0,
						height: "100%",
						width: "100%",
					}}
					allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
					allowFullScreen
				></iframe>
			</div>

			<StatsCards />

			<div className="grid md:grid-cols-2 gap-6">
				<TopAuthorsCard />
				<CategoryDistributionCard />
			</div>

			<RecentArticlesCard />
		</div>
	);
}
