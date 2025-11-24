import { Link } from "@tanstack/react-router";
import { useCategoryArticlesQuery } from "../../-hooks/useCategoryArticlesQuery";
import { useCategoryQuery } from "../../-hooks/useCategoryQuery";

interface CategoryArticlesProps {
	categoryId: number;
}

export function CategoryArticles({ categoryId }: CategoryArticlesProps) {
	const { data: category } = useCategoryQuery(categoryId);
	const { data: articles } = useCategoryArticlesQuery(categoryId);

	if (!category) {
		return null;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
				<div className="w-3 h-3 bg-primary border border-foreground"></div>
				<h2 className="text-xl font-bold font-mono uppercase">
					Articles in {category.name}
				</h2>
			</div>

			{!articles || articles.length === 0 ? (
				<div className="text-muted-foreground font-mono">
					No articles found in this category.
				</div>
			) : (
				<div className="space-y-4">
					{articles.map((article) => (
						<div
							key={article.id}
							className="border-2 border-foreground rounded-sm p-4 hover:bg-muted/20 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--foreground)] bg-white group"
						>
							<div className="flex items-start gap-6">
								{article.coverImage && (
									<img
										src={article.coverImage}
										alt={article.title}
										className="w-32 h-24 object-cover rounded-sm border-2 border-foreground"
									/>
								)}

								<div className="flex-1 min-w-0">
									<Link
										to="/articles/$articleId"
										params={{ articleId: String(article.id) }}
										className="block"
									>
										<h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors truncate">
											{article.title}
										</h3>
									</Link>

									{article.excerpt && (
										<p className="text-muted-foreground text-sm mb-3 line-clamp-2">
											{article.excerpt}
										</p>
									)}

									<div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
										{article.author && (
											<Link
												to="/users/$userId"
												params={{ userId: String(article.author.id) }}
												className="flex items-center gap-2 hover:text-primary font-bold uppercase"
											>
												{article.author.avatar ? (
													<img
														src={article.author.avatar}
														alt={article.author.displayName}
														className="w-5 h-5 rounded-sm border border-foreground object-cover"
													/>
												) : (
													<div className="w-5 h-5 rounded-sm bg-muted border border-foreground flex items-center justify-center">
														<span className="text-[10px]">
															{article.author.displayName[0].toUpperCase()}
														</span>
													</div>
												)}
												<span>{article.author.displayName}</span>
											</Link>
										)}

										<span className="ml-auto">
											{article.createdAt.toLocaleDateString("zh-CN")}
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
