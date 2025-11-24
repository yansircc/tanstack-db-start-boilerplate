import { Link } from "@tanstack/react-router";
import { useUserArticlesQuery } from "../../-hooks/use-user-articles-query";

type UserPublishedArticlesProps = {
	userId: number;
};

export function UserPublishedArticles({ userId }: UserPublishedArticlesProps) {
	const { data: articles } = useUserArticlesQuery(userId);

	const publishedArticles =
		articles?.filter((a) => a.status === "published") ?? [];

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 border-foreground border-b-2 pb-2">
				<div className="h-2 w-2 rounded-full border border-foreground bg-green-500" />
				<h2 className="font-bold font-mono text-xl uppercase">
					Published Articles
				</h2>
			</div>

			{publishedArticles.length === 0 ? (
				<div className="font-mono text-muted-foreground text-sm">
					No published articles.
				</div>
			) : (
				<div className="space-y-3">
					{publishedArticles.map((article) => (
						<div
							className="group rounded-sm border-2 border-foreground bg-white p-4 transition-colors hover:bg-muted/30"
							key={article.id}
						>
							<Link
								className="block"
								params={{ articleId: String(article.id) }}
								to="/articles/$articleId"
							>
								<h3 className="mb-2 font-bold font-mono text-lg transition-colors group-hover:text-primary">
									{article.title}
								</h3>
							</Link>

							{article.excerpt && (
								<p className="mb-3 line-clamp-2 text-muted-foreground text-sm">
									{article.excerpt}
								</p>
							)}

							<div className="flex items-center gap-4 font-mono text-muted-foreground text-xs">
								{article.category && (
									<Link
										className="rounded-sm border border-foreground/30 bg-muted px-2 py-0.5 transition-colors hover:border-foreground"
										params={{ categoryId: String(article.category.id) }}
										to="/categories/$categoryId"
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
