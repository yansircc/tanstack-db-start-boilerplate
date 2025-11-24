import { Link } from "@tanstack/react-router";
import { useUserArticlesQuery } from "../../-hooks/useUserArticlesQuery";

interface UserPublishedArticlesProps {
	userId: number;
}

export function UserPublishedArticles({ userId }: UserPublishedArticlesProps) {
	const { data: articles } = useUserArticlesQuery(userId);

	const publishedArticles =
		articles?.filter((a) => a.status === "published") ?? [];

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold text-gray-900">已发布的文章</h2>

			{publishedArticles.length === 0 ? (
				<p className="text-gray-500">暂无已发布文章</p>
			) : (
				<div className="space-y-3">
					{publishedArticles.map((article) => (
						<div
							key={article.id}
							className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
						>
							<Link
								to="/articles/$articleId"
								params={{ articleId: String(article.id) }}
							>
								<h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
									{article.title}
								</h3>
							</Link>

							{article.excerpt && (
								<p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>
							)}

							<div className="flex items-center gap-4 text-sm text-gray-500">
								{article.category && (
									<Link
										to="/categories/$categoryId"
										params={{ categoryId: String(article.category.id) }}
										className="bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
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
					))}
				</div>
			)}
		</div>
	);
}
