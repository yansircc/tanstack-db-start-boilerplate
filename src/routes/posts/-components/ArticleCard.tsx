import { Link } from "@tanstack/react-router";
import type { ArticleWithRelations } from "./types";

interface ArticleCardProps {
	article: ArticleWithRelations;
}

export function ArticleCard({ article }: ArticleCardProps) {
	return (
		<Link
			to="/posts/$postId"
			params={{ postId: String(article.id) }}
			className="block"
		>
			<article className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
			<h2 className="text-xl font-semibold mb-2">{article.title}</h2>

			{article.excerpt && (
				<p className="text-gray-600 mb-3">{article.excerpt}</p>
			)}

			<div className="flex items-center gap-4 text-sm text-gray-500">
				{article.author && (
					<div className="flex items-center gap-2">
						{article.author.avatar && (
							<img
								src={article.author.avatar}
								alt={article.author.displayName}
								className="w-6 h-6 rounded-full"
							/>
						)}
						<span>{article.author.displayName}</span>
					</div>
				)}

				{article.category && (
					<span className="bg-gray-100 px-2 py-1 rounded">
						{article.category.name}
					</span>
				)}

				<span>阅读 {article.viewCount}</span>

				<time className="ml-auto">
					{article.createdAt.toLocaleDateString("zh-CN")}
				</time>
			</div>
		</article>
		</Link>
	);
}
