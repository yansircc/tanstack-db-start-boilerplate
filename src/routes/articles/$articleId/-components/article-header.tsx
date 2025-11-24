import { Link } from "@tanstack/react-router";
import { useArticleDetailQuery } from "../../-hooks/use-article-detail-query";
import { ArticleBookmarkButton } from "./article-bookmark-button";
import { ArticleLikeButton } from "./article-like-button";

type ArticleHeaderProps = {
	articleId: number;
};

export function ArticleHeader({ articleId }: ArticleHeaderProps) {
	const { data: article } = useArticleDetailQuery(articleId);

	if (!article) {
		return (
			<div className="py-12 text-center font-mono text-muted-foreground uppercase">
				Article not found
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-3">
				{article.category && (
					<Link
						className="rounded-sm border border-foreground bg-secondary px-3 py-1 font-bold font-mono text-xs uppercase transition-colors hover:bg-white"
						params={{ categoryId: String(article.category.id) }}
						to="/categories/$categoryId"
					>
						{article.category.name}
					</Link>
				)}
				<span className="font-mono text-muted-foreground text-xs uppercase">
					{article.createdAt.toLocaleDateString("zh-CN")}
				</span>
			</div>

			<h1 className="font-bold font-mono text-5xl text-foreground uppercase leading-tight tracking-tight">
				{article.title}
			</h1>

			<div className="flex items-center justify-between border-foreground/10 border-y-2 py-4">
				<div className="flex items-center gap-4">
					{article.author && (
						<Link
							className="group flex items-center gap-3"
							params={{ userId: String(article.author.id) }}
							to="/users/$userId"
						>
							{article.author.avatar ? (
								<img
									alt={article.author.displayName}
									className="h-12 w-12 rounded-sm border-2 border-foreground object-cover"
									height={48}
									src={article.author.avatar}
									width={48}
								/>
							) : (
								<div className="flex h-12 w-12 items-center justify-center rounded-sm border-2 border-foreground bg-muted">
									<span className="font-bold font-mono text-lg">
										{article.author.displayName[0].toUpperCase()}
									</span>
								</div>
							)}
							<div>
								<div className="font-bold font-mono uppercase transition-colors group-hover:text-primary">
									{article.author.displayName}
								</div>
								<div className="font-mono text-muted-foreground text-xs">
									@{article.author.username}
								</div>
							</div>
						</Link>
					)}
				</div>

				<div className="flex items-center gap-3">
					<div className="mr-4 font-bold font-mono text-muted-foreground text-xs uppercase">
						{article.viewCount} Views
					</div>
					<ArticleLikeButton articleId={articleId} />
					<ArticleBookmarkButton articleId={articleId} />
				</div>
			</div>
		</div>
	);
}
