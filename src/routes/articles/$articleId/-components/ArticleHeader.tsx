import { Link } from "@tanstack/react-router";
import { useArticleDetailQuery } from "../../-hooks/useArticleDetailQuery";
import { ArticleLikeButton } from "./ArticleLikeButton";
import { ArticleBookmarkButton } from "./ArticleBookmarkButton";

interface ArticleHeaderProps {
	articleId: number;
}

export function ArticleHeader({ articleId }: ArticleHeaderProps) {
	const { data: article } = useArticleDetailQuery(articleId);

	if (!article) {
		return (
			<div className="text-center text-muted-foreground font-mono uppercase py-12">
				Article not found
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-3">
				{article.category && (
					<Link
						to="/categories/$categoryId"
						params={{ categoryId: String(article.category.id) }}
						className="bg-secondary px-3 py-1 rounded-sm border border-foreground text-xs font-mono font-bold uppercase hover:bg-white transition-colors"
					>
						{article.category.name}
					</Link>
				)}
				<span className="text-xs font-mono text-muted-foreground uppercase">
					{article.createdAt.toLocaleDateString("zh-CN")}
				</span>
			</div>

			<h1 className="text-5xl font-bold font-mono text-foreground uppercase tracking-tight leading-tight">
				{article.title}
			</h1>

			<div className="flex items-center justify-between border-y-2 border-foreground/10 py-4">
				<div className="flex items-center gap-4">
					{article.author && (
						<Link
							to="/users/$userId"
							params={{ userId: String(article.author.id) }}
							className="flex items-center gap-3 group"
						>
							{article.author.avatar ? (
								<img
									src={article.author.avatar}
									alt={article.author.displayName}
									className="w-12 h-12 rounded-sm border-2 border-foreground object-cover"
								/>
							) : (
								<div className="w-12 h-12 rounded-sm border-2 border-foreground bg-muted flex items-center justify-center">
									<span className="text-lg font-bold font-mono">
										{article.author.displayName[0].toUpperCase()}
									</span>
								</div>
							)}
							<div>
								<div className="font-bold font-mono uppercase group-hover:text-primary transition-colors">
									{article.author.displayName}
								</div>
								<div className="text-xs font-mono text-muted-foreground">
									@{article.author.username}
								</div>
							</div>
						</Link>
					)}
				</div>

				<div className="flex items-center gap-3">
					<div className="text-xs font-mono font-bold uppercase text-muted-foreground mr-4">
						{article.viewCount} Views
					</div>
					<ArticleLikeButton articleId={articleId} />
					<ArticleBookmarkButton articleId={articleId} />
				</div>
			</div>
		</div>
	);
}
