import { Link } from "@tanstack/react-router";
import { useUserBookmarkedArticlesQuery } from "../-hooks/useUserBookmarkedArticlesQuery";
import { Bookmark } from "lucide-react";

interface UserBookmarkedArticlesProps {
	userId: number;
}

export function UserBookmarkedArticles({
	userId,
}: UserBookmarkedArticlesProps) {
	const { data: articles } = useUserBookmarkedArticlesQuery(userId);

	if (!articles || articles.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
				<Bookmark className="w-6 h-6 text-blue-500 fill-current" />
				收藏的文章
			</h2>
			<div className="space-y-3">
				{articles.map((article) => (
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
							{article.author && (
								<Link
									to="/users/$userId"
									params={{ userId: String(article.author.id) }}
									className="hover:text-blue-600"
								>
									{article.author.displayName}
								</Link>
							)}
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
							<time className="ml-auto text-xs">
								收藏于 {article.bookmarkedAt.toLocaleDateString("zh-CN")}
							</time>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
