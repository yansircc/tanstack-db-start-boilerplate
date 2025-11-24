import { Link } from "@tanstack/react-router";
import { useTagArticlesQuery } from "../../-hooks/useTagArticlesQuery";
import { useTagQuery } from "../../-hooks/useTagQuery";

interface TagArticlesProps {
	tagId: number;
}

export function TagArticles({ tagId }: TagArticlesProps) {
	const { data: tag } = useTagQuery(tagId);
	const { data: articles } = useTagArticlesQuery(tagId);

	if (!tag) {
		return null;
	}

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold text-gray-900">
				标签 #{tag.name} 的文章
			</h2>

			{!articles || articles.length === 0 ? (
				<p className="text-gray-500">该标签下暂无文章</p>
			) : (
				<div className="space-y-4">
					{articles.map((article) => (
						<div
							key={article.id}
							className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition space-y-3"
						>
							<div className="flex items-start gap-4">
								{article.coverImage && (
									<img
										src={article.coverImage}
										alt={article.title}
										className="w-32 h-24 object-cover rounded"
									/>
								)}

								<div className="flex-1">
									<Link
										to="/posts/$postId"
										params={{ postId: String(article.id) }}
									>
										<h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
											{article.title}
										</h3>
									</Link>

									{article.excerpt && (
										<p className="text-gray-600 text-sm mb-3">
											{article.excerpt}
										</p>
									)}

									<div className="flex items-center gap-4 text-sm text-gray-500">
										{article.author && (
											<Link
												to="/users/$userId"
												params={{ userId: String(article.author.id) }}
												className="flex items-center gap-2 hover:text-blue-600"
											>
												{article.author.avatar ? (
													<img
														src={article.author.avatar}
														alt={article.author.displayName}
														className="w-6 h-6 rounded-full"
													/>
												) : (
													<div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
														<span className="text-xs text-gray-500">
															{article.author.displayName[0].toUpperCase()}
														</span>
													</div>
												)}
												<span>{article.author.displayName}</span>
											</Link>
										)}

										{article.category && (
											<Link
												to="/categories/$categoryId"
												params={{ categoryId: String(article.category.id) }}
												className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200"
											>
												{article.category.name}
											</Link>
										)}

										<span>阅读 {article.viewCount}</span>

										<time className="ml-auto">
											{article.createdAt.toLocaleDateString("zh-CN")}
										</time>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
