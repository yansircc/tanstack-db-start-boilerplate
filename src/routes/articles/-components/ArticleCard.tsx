import { Link } from "@tanstack/react-router";
import type { ArticleWithRelations } from "./types";

interface ArticleCardProps {
	article: ArticleWithRelations;
}

export function ArticleCard({ article }: ArticleCardProps) {
	return (
		<div className="flex-1">
			<Link
				to="/articles/$articleId"
				params={{ articleId: String(article.id) }}
				className="block"
			>
				<h2 className="text-xl font-semibold mb-2 hover:text-blue-600">
					{article.title}
				</h2>

				{article.excerpt && (
					<p className="text-gray-600 mb-3">{article.excerpt}</p>
				)}
			</Link>

			<div className="flex items-center gap-4 text-sm text-gray-500">
				{article.author && (
					<Link
						to="/users/$userId"
						params={{ userId: String(article.author.id) }}
						className="flex items-center gap-2 hover:text-blue-600"
						onClick={(e) => e.stopPropagation()}
					>
						{article.author.avatar && (
							<img
								src={article.author.avatar}
								alt={article.author.displayName}
								className="w-6 h-6 rounded-full"
							/>
						)}
						<span>{article.author.displayName}</span>
					</Link>
				)}

				{article.category && (
					<Link
						to="/categories/$categoryId"
						params={{ categoryId: String(article.category.id) }}
						className="bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
						onClick={(e) => e.stopPropagation()}
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
	);
}
