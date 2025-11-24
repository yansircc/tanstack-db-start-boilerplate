import { Link } from "@tanstack/react-router";
import { ArticleStats } from "./article-stats";
import type { ArticleWithRelations } from "./types";

type ArticleCardProps = {
	article: ArticleWithRelations;
};

export function ArticleCard({ article }: ArticleCardProps) {
	return (
		<div className="min-w-0 flex-1">
			<div className="mb-2 flex items-center gap-3">
				{article.category && (
					<Link
						className="rounded-sm border border-foreground bg-secondary px-2 py-0.5 font-bold font-mono text-xs uppercase transition-colors hover:bg-white"
						onClick={(e) => e.stopPropagation()}
						params={{ categoryId: String(article.category.id) }}
						to="/categories/$categoryId"
					>
						{article.category.name}
					</Link>
				)}
				<time className="font-mono text-muted-foreground text-xs">
					{article.createdAt.toLocaleDateString("zh-CN")}
				</time>
			</div>

			<Link
				className="block transition-transform duration-200 group-hover:translate-x-1"
				params={{ articleId: String(article.id) }}
				to="/articles/$articleId"
			>
				<h2 className="mb-2 truncate font-bold text-2xl transition-colors group-hover:text-primary">
					{article.title}
				</h2>

				{article.excerpt && (
					<p className="mb-4 line-clamp-2 text-muted-foreground">
						{article.excerpt}
					</p>
				)}
			</Link>

			<div className="mt-2 flex items-center gap-6 border-foreground/10 border-t pt-4 text-sm">
				{article.author && (
					<Link
						className="flex items-center gap-2 font-bold font-mono transition-colors hover:text-primary"
						onClick={(e) => e.stopPropagation()}
						params={{ userId: String(article.author.id) }}
						to="/users/$userId"
					>
						{article.author.avatar ? (
							<img
								alt={article.author.displayName}
								className="h-6 w-6 rounded-sm border border-foreground"
								height={24}
								src={article.author.avatar}
								width={24}
							/>
						) : (
							<div className="flex h-6 w-6 items-center justify-center rounded-sm border border-foreground bg-muted text-xs">
								{article.author.displayName[0].toUpperCase()}
							</div>
						)}
						<span className="uppercase">{article.author.displayName}</span>
					</Link>
				)}

				<div className="ml-auto flex items-center gap-4 font-mono text-xs">
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
