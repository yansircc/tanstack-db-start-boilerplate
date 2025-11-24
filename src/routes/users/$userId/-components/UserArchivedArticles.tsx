import { Link } from "@tanstack/react-router";
import { useUserArticlesQuery } from "../../-hooks/useUserArticlesQuery";

interface UserArchivedArticlesProps {
	userId: number;
}

export function UserArchivedArticles({ userId }: UserArchivedArticlesProps) {
	const { data: articles } = useUserArticlesQuery(userId);

	const archivedArticles =
		articles?.filter((a) => a.status === "archived") ?? [];

	if (archivedArticles.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold text-gray-900">已归档的文章</h2>
			<div className="space-y-3">
				{archivedArticles.map((article) => (
					<div
						key={article.id}
						className="border border-gray-200 rounded-lg p-4 bg-gray-50"
					>
						<div className="flex items-start gap-2">
							<span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
								已归档
							</span>
							<div className="flex-1">
								<Link
									to="/articles/$articleId"
									params={{ articleId: String(article.id) }}
								>
									<h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
										{article.title}
									</h3>
								</Link>
								{article.excerpt && (
									<p className="text-gray-600 text-sm mt-1">
										{article.excerpt}
									</p>
								)}
								<div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
									{article.category && (
										<Link
											to="/categories/$categoryId"
											params={{ categoryId: String(article.category.id) }}
											className="bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
										>
											{article.category.name}
										</Link>
									)}
									<time className="ml-auto">
										{article.createdAt.toLocaleDateString("zh-CN")}
									</time>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
