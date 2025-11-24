import { Link } from "@tanstack/react-router";
import { useRecentArticlesQuery } from "../-hooks/use-recent-articles-query";

export function RecentArticlesCard() {
	const { data: articles } = useRecentArticlesQuery();

	return (
		<div className="overflow-hidden rounded-sm border-2 border-foreground bg-white p-0">
			<div className="flex items-center justify-between border-foreground border-b-2 bg-secondary p-4">
				<h2 className="font-bold font-mono text-foreground text-lg uppercase">
					Recent Updates
				</h2>
				<div className="rounded-sm border border-foreground bg-white px-2 py-1 font-bold font-mono text-xs">
					LIVE
				</div>
			</div>

			{!articles || articles.length === 0 ? (
				<div className="p-8 text-center font-mono text-muted-foreground">
					NO DATA FOUND
				</div>
			) : (
				<div>
					{articles.map((article) => (
						<Link
							className="group flex items-center justify-between border-foreground/10 border-b p-4 transition-colors last:border-b-0 hover:bg-muted"
							key={article.id}
							params={{ articleId: String(article.id) }}
							to="/articles/$articleId"
						>
							<div className="flex-1">
								<div className="mb-1 font-bold text-lg transition-colors group-hover:text-primary">
									{article.title}
								</div>
								<div className="flex items-center gap-3 font-mono text-muted-foreground text-xs">
									<span className="rounded-sm bg-foreground/5 px-1">
										BY {article.authorName?.toUpperCase()}
									</span>
									<span>{article.createdAt.toLocaleDateString("zh-CN")}</span>
								</div>
							</div>
							<div className="rounded-sm border border-transparent bg-muted px-2 py-1 font-bold font-mono text-foreground/50 text-sm group-hover:border-foreground/20">
								{article.viewCount} VIEWS
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
