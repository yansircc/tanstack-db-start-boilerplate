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
			<div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
				<div className="w-2 h-2 rounded-full bg-green-500 border border-foreground"></div>
				<h2 className="text-xl font-bold font-mono uppercase">Published Articles</h2>
			</div>

			{publishedArticles.length === 0 ? (
				<div className="text-sm text-muted-foreground font-mono">No published articles.</div>
			) : (
				<div className="space-y-3">
					{publishedArticles.map((article) => (
						<div
							key={article.id}
							className="border-2 border-foreground rounded-sm p-4 hover:bg-muted/30 transition-colors bg-white group"
						>
							<Link
								to="/articles/$articleId"
								params={{ articleId: String(article.id) }}
								className="block"
							>
								<h3 className="text-lg font-bold font-mono mb-2 group-hover:text-primary transition-colors">
									{article.title}
								</h3>
							</Link>

							{article.excerpt && (
								<p className="text-muted-foreground text-sm mb-3 line-clamp-2">{article.excerpt}</p>
							)}

							<div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
								{article.category && (
									<Link
										to="/categories/$categoryId"
										params={{ categoryId: String(article.category.id) }}
										className="bg-muted px-2 py-0.5 rounded-sm border border-foreground/30 hover:border-foreground transition-colors"
									>
										{article.category.name}
									</Link>
								)}
								<span>READS: {article.viewCount}</span>
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
