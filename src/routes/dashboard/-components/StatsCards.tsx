import type { Stats } from "./types";

interface StatsCardsProps {
	stats: Stats | undefined;
}

export function StatsCards({ stats }: StatsCardsProps) {
	const firstStat = Array.isArray(stats) ? stats[0] : stats;

	return (
		<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
			<div className="bg-blue-50 rounded-lg p-4 text-center">
				<div className="text-3xl font-bold text-blue-600">
					{firstStat?.totalArticles ?? 0}
				</div>
				<div className="text-sm text-gray-600">文章总数</div>
			</div>
			<div className="bg-green-50 rounded-lg p-4 text-center">
				<div className="text-3xl font-bold text-green-600">
					{firstStat?.totalUsers ?? 0}
				</div>
				<div className="text-sm text-gray-600">用户总数</div>
			</div>
			<div className="bg-purple-50 rounded-lg p-4 text-center">
				<div className="text-3xl font-bold text-purple-600">
					{firstStat?.totalCategories ?? 0}
				</div>
				<div className="text-sm text-gray-600">分类总数</div>
			</div>
			<div className="bg-orange-50 rounded-lg p-4 text-center">
				<div className="text-3xl font-bold text-orange-600">
					{firstStat?.totalTags ?? 0}
				</div>
				<div className="text-sm text-gray-600">标签总数</div>
			</div>
			<div className="bg-pink-50 rounded-lg p-4 text-center">
				<div className="text-3xl font-bold text-pink-600">
					{firstStat?.totalComments ?? 0}
				</div>
				<div className="text-sm text-gray-600">评论总数</div>
			</div>
		</div>
	);
}
