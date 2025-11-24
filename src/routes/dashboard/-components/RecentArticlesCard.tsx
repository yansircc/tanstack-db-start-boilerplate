import { useRecentArticlesQuery } from "../-hooks/useRecentArticlesQuery";

export function RecentArticlesCard() {
	const { data: articles } = useRecentArticlesQuery();

	return (
		<div className="border border-gray-200 rounded-lg p-4">
			<h2 className="text-xl font-semibold mb-4">最新文章</h2>
			{!articles || articles.length === 0 ? (
				<p className="text-gray-500">暂无数据</p>
			) : (
				<div className="space-y-2">
					{articles.map((article) => (
						<div
							key={article.id}
							className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
						>
							<div className="flex-1">
								<div className="font-medium">{article.title}</div>
								<div className="text-sm text-gray-500">
									{article.authorName} ·{" "}
									{article.createdAt.toLocaleDateString("zh-CN")}
								</div>
							</div>
							<div className="text-sm text-gray-500">
								阅读 {article.viewCount}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
