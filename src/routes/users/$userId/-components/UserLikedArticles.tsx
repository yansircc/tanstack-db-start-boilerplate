import { Link } from "@tanstack/react-router";
import { useUserLikedArticlesQuery } from "../-hooks/useUserLikedArticlesQuery";
import { Heart } from "lucide-react";

interface UserLikedArticlesProps {
	userId: number;
}

export function UserLikedArticles({ userId }: UserLikedArticlesProps) {
	const { data: articles } = useUserLikedArticlesQuery(userId);

	if (!articles || articles.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
				<Heart className="w-6 h-6 text-red-500 fill-current" />
				点赞的文章
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
								点赞于 {article.likedAt.toLocaleDateString("zh-CN")}
							</time>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
