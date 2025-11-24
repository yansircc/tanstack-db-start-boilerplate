import { Link } from "@tanstack/react-router";
import { useStatsQuery } from "../-hooks/useStatsQuery";

export function StatsCards() {
	const { data: stats } = useStatsQuery();

	return (
		<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
			<Link to="/articles" className="bg-blue-50 rounded-lg p-4 text-center">
				<div className="text-3xl font-bold text-blue-600">
					{stats?.totalArticles ?? 0}
				</div>
				<div className="text-sm text-gray-600">文章总数</div>
			</Link>

			<Link to="/users" className="bg-green-50 rounded-lg p-4 text-center">
				<div className="text-3xl font-bold text-green-600">
					{stats?.totalUsers ?? 0}
				</div>
				<div className="text-sm text-gray-600">用户总数</div>
			</Link>

			<Link
				to="/categories"
				className="bg-purple-50 rounded-lg p-4 text-center"
			>
				<div className="text-3xl font-bold text-purple-600">
					{stats?.totalCategories ?? 0}
				</div>
				<div className="text-sm text-gray-600">分类总数</div>
			</Link>

			<Link to="/tags" className="bg-orange-50 rounded-lg p-4 text-center">
				<div className="text-3xl font-bold text-orange-600">
					{stats?.totalTags ?? 0}
				</div>
				<div className="text-sm text-gray-600">标签总数</div>
			</Link>

			<Link to="/comments" className="bg-pink-50 rounded-lg p-4 text-center">
				<div className="text-3xl font-bold text-pink-600">
					{stats?.totalComments ?? 0}
				</div>
				<div className="text-sm text-gray-600">评论总数</div>
			</Link>
		</div>
	);
}
