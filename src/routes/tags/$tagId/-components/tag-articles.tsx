import { Link } from "@tanstack/react-router";
import { useTagArticlesQuery } from "../../-hooks/use-tag-articles-query";
import { useTagQuery } from "../../-hooks/use-tag-query";

type TagArticlesProps = {
	tagId: number;
};

export function TagArticles({ tagId }: TagArticlesProps) {
	const { data: tag } = useTagQuery(tagId);
	const { data: articles } = useTagArticlesQuery(tagId);

	if (!tag) {
		return null;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2 border-foreground border-b-2 pb-2">
				<div className="h-3 w-3 border border-foreground bg-accent" />
				<h2 className="font-bold font-mono text-xl uppercase">
					Articles tagged with #{tag.name}
				</h2>
			</div>

			{!articles || articles.length === 0 ? (
				<div className="font-mono text-muted-foreground">
					No articles found in this tag.
				</div>
			) : (
				<div className="space-y-4">
					{articles.map((article) => (
						<div
							className="hover:-translate-y-1 group rounded-sm border-2 border-foreground bg-white p-4 transition-all hover:bg-muted/20 hover:shadow-[4px_4px_0px_0px_var(--foreground)]"
							key={article.id}
						>
							<div className="flex items-start gap-6">
								{article.coverImage && (
									<img
										alt={article.title}
										className="h-24 w-32 rounded-sm border-2 border-foreground object-cover"
										height={128}
										src={article.coverImage}
										width={128}
									/>
								)}

								<div className="min-w-0 flex-1">
									<Link
										className="block"
										params={{ articleId: String(article.id) }}
										to="/articles/$articleId"
									>
										<h3 className="mb-2 truncate font-bold text-xl transition-colors group-hover:text-primary">
											{article.title}
										</h3>
									</Link>

									{article.excerpt && (
										<p className="mb-3 line-clamp-2 text-muted-foreground text-sm">
											{article.excerpt}
										</p>
									)}

									<div className="flex items-center gap-4 font-mono text-muted-foreground text-xs">
										{article.author && (
											<Link
												className="flex items-center gap-2 font-bold uppercase hover:text-primary"
												params={{ userId: String(article.author.id) }}
												to="/users/$userId"
											>
												{article.author.avatar ? (
													<img
														alt={article.author.displayName}
														className="h-5 w-5 rounded-sm border border-foreground object-cover"
														height={20}
														src={article.author.avatar}
														width={20}
													/>
												) : (
													<div className="flex h-5 w-5 items-center justify-center rounded-sm border border-foreground bg-muted">
														<span className="text-[10px]">
															{article.author.displayName[0].toUpperCase()}
														</span>
													</div>
												)}
												<span>{article.author.displayName}</span>
											</Link>
										)}

										{article.category && (
											<Link
												className="rounded-sm border border-foreground/50 bg-secondary/50 px-2 py-0.5 transition-colors hover:border-foreground hover:bg-secondary"
												params={{ categoryId: String(article.category.id) }}
												to="/categories/$categoryId"
											>
												{article.category.name}
											</Link>
										)}

										<span className="ml-auto">
											{article.createdAt?.toLocaleDateString("zh-CN")}
										</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
