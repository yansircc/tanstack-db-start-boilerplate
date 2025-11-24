import { useTopAuthorsQuery } from "../-hooks/useTopAuthorsQuery";

export function TopAuthorsCard() {
	const { data: authors } = useTopAuthorsQuery();

	return (
		<div className="border border-gray-200 rounded-lg p-4">
			<h2 className="text-xl font-semibold mb-4">热门作者</h2>
			{!authors || authors.length === 0 ? (
				<p className="text-gray-500">暂无数据</p>
			) : (
				<div className="space-y-3">
					{authors.map((author, index) => (
						<div
							key={author.authorId}
							className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
						>
							<span className="text-lg font-bold text-gray-400 w-6">
								{index + 1}
							</span>
							{author.avatar ? (
								<img
									src={author.avatar}
									alt={author.authorName}
									className="w-10 h-10 rounded-full"
								/>
							) : (
								<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
									<span className="text-sm text-gray-500">
										{author.authorName?.[0]?.toUpperCase() || "?"}
									</span>
								</div>
							)}
							<div className="flex-1">
								<div className="font-medium">{author.authorName}</div>
								<div className="text-sm text-gray-500">
									{author.articleCount} 篇文章
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
