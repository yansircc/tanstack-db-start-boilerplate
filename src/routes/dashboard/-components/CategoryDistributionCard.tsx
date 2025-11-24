import type { CategoryStat } from "./types";

interface CategoryDistributionCardProps {
	categories: CategoryStat[] | undefined;
}

export function CategoryDistributionCard({
	categories,
}: CategoryDistributionCardProps) {
	return (
		<div className="border border-gray-200 rounded-lg p-4">
			<h2 className="text-xl font-semibold mb-4">分类分布</h2>
			{!categories || categories.length === 0 ? (
				<p className="text-gray-500">暂无数据</p>
			) : (
				<div className="space-y-2">
					{categories.map((cat) => (
						<div key={cat.categoryId} className="flex items-center gap-2">
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
						</div>
					))}
				</div>
			)}
		</div>
	);
}
