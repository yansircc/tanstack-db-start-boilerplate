import { Link } from "@tanstack/react-router";
import { useRecentArticlesQuery } from "../-hooks/useRecentArticlesQuery";

export function RecentArticlesCard() {
	const { data: articles } = useRecentArticlesQuery();

	return (
		<div className="border-2 border-foreground rounded-sm bg-white p-0 overflow-hidden">
			<div className="bg-secondary p-4 border-b-2 border-foreground flex items-center justify-between">
				<h2 className="text-lg font-mono font-bold uppercase text-foreground">
					Recent Updates
				</h2>
				<div className="text-xs font-mono font-bold bg-white border border-foreground px-2 py-1 rounded-sm">
					LIVE
				</div>
			</div>

			{!articles || articles.length === 0 ? (
				<div className="p-8 text-center text-muted-foreground font-mono">
					NO DATA FOUND
				</div>
			) : (
				<div>
					{articles.map((article) => (
						<Link
							key={article.id}
							to="/articles/$articleId"
							params={{ articleId: String(article.id) }}
							className="flex items-center justify-between p-4 border-b border-foreground/10 last:border-b-0 hover:bg-muted transition-colors group"
						>
							<div className="flex-1">
								<div className="font-bold text-lg group-hover:text-primary transition-colors mb-1">
									{article.title}
								</div>
								<div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
									<span className="bg-foreground/5 px-1 rounded-sm">
										BY {article.authorName?.toUpperCase()}
									</span>
									<span>{article.createdAt.toLocaleDateString("zh-CN")}</span>
								</div>
							</div>
							<div className="text-sm font-mono font-bold text-foreground/50 bg-muted px-2 py-1 rounded-sm border border-transparent group-hover:border-foreground/20">
								{article.viewCount} VIEWS
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
