import { Link } from "@tanstack/react-router";
import { useCategoryStatsQuery } from "../-hooks/useCategoryStatsQuery";

export function CategoryDistributionCard() {
	const { data: categories } = useCategoryStatsQuery();

	return (
		<div className="border border-gray-200 rounded-lg p-4">
			<h2 className="text-xl font-semibold mb-4">分类分布</h2>
			{!categories || categories.length === 0 ? (
				<p className="text-gray-500">暂无数据</p>
			) : (
				<div className="space-y-2">
					{categories.map((cat) => (
						<Link
							key={cat.categoryId}
							to="/categories/$categoryId"
							params={{ categoryId: String(cat.categoryId) }}
							className="flex items-center gap-2 hover:bg-gray-50 rounded p-1"
						>
							<div className="flex-1 flex items-center gap-2">
								<span className="text-sm font-medium">{cat.categoryName}</span>
								<div className="flex-1 bg-gray-200 rounded-full h-2">
									<div
										className="bg-blue-500 h-2 rounded-full"
										style={{
											width: `${Math.min((cat.articleCount / (categories[0]?.articleCount || 1)) * 100, 100)}%`,
										}}
									/>
								</div>
							</div>
							<span className="text-sm text-gray-600 w-12 text-right">
								{cat.articleCount}
							</span>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
