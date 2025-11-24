import { Link } from "@tanstack/react-router";
import type { ArticleWithRelations } from "./types";
import { ArticleStats } from "./ArticleStats";

interface ArticleCardProps {
	article: ArticleWithRelations;
}

export function ArticleCard({ article }: ArticleCardProps) {
	return (
		<div className="flex-1 min-w-0">
			<div className="flex items-center gap-3 mb-2">
				{article.category && (
					<Link
						to="/categories/$categoryId"
						params={{ categoryId: String(article.category.id) }}
						className="text-xs font-mono font-bold uppercase bg-secondary px-2 py-0.5 rounded-sm border border-foreground hover:bg-white transition-colors"
						onClick={(e) => e.stopPropagation()}
					>
						{article.category.name}
					</Link>
				)}
				<time className="text-xs font-mono text-muted-foreground">
					{article.createdAt.toLocaleDateString("zh-CN")}
				</time>
			</div>

			<Link
				to="/articles/$articleId"
				params={{ articleId: String(article.id) }}
				className="block group-hover:translate-x-1 transition-transform duration-200"
			>
				<h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors truncate">
					{article.title}
				</h2>

				{article.excerpt && (
					<p className="text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
				)}
			</Link>

			<div className="flex items-center gap-6 text-sm border-t border-foreground/10 pt-4 mt-2">
				{article.author && (
					<Link
						to="/users/$userId"
						params={{ userId: String(article.author.id) }}
						className="flex items-center gap-2 font-mono font-bold hover:text-primary transition-colors"
						onClick={(e) => e.stopPropagation()}
					>
						{article.author.avatar ? (
							<img
								src={article.author.avatar}
								alt={article.author.displayName}
								className="w-6 h-6 rounded-sm border border-foreground"
							/>
						) : (
							<div className="w-6 h-6 rounded-sm border border-foreground bg-muted flex items-center justify-center text-xs">
								{article.author.displayName[0].toUpperCase()}
							</div>
						)}
						<span className="uppercase">{article.author.displayName}</span>
					</Link>
				)}

				<div className="flex items-center gap-4 ml-auto font-mono text-xs">
					<span className="flex items-center gap-1">
						<span>READS:</span>
						<span className="font-bold">{article.viewCount}</span>
					</span>
					
					{/* 点赞和收藏统计 */}
					<ArticleStats articleId={article.id} />
				</div>
			</div>
		</div>
	);
}
