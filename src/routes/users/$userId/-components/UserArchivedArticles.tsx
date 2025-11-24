import { Link } from "@tanstack/react-router";
import { useUserArticlesQuery } from "../../-hooks/useUserArticlesQuery";

interface UserArchivedArticlesProps {
	userId: number;
}

export function UserArchivedArticles({ userId }: UserArchivedArticlesProps) {
	const { data: articles } = useUserArticlesQuery(userId);

	const archivedArticles =
		articles?.filter((a) => a.status === "archived") ?? [];

	if (archivedArticles.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
				<div className="w-2 h-2 rounded-full bg-gray-500 border border-foreground"></div>
				<h2 className="text-xl font-bold font-mono uppercase">Archived</h2>
			</div>

			<div className="space-y-3">
				{archivedArticles.map((article) => (
					<div
						key={article.id}
						className="border-2 border-foreground rounded-sm p-4 bg-muted/50 opacity-75 hover:opacity-100 transition-opacity"
					>
						<div className="flex items-start gap-3">
							<span className="bg-muted text-muted-foreground border border-foreground/30 font-mono text-[10px] uppercase px-2 py-0.5 rounded-sm shrink-0 mt-1">
								Archived
							</span>
							<div className="flex-1 min-w-0">
								<Link
									to="/articles/$articleId"
									params={{ articleId: String(article.id) }}
									className="block"
								>
									<h3 className="text-lg font-bold font-mono text-foreground hover:text-primary transition-colors truncate">
										{article.title}
									</h3>
								</Link>
								{article.excerpt && (
									<p className="text-muted-foreground text-sm mt-1 line-clamp-1">
										{article.excerpt}
									</p>
								)}
								<div className="flex items-center gap-4 text-xs font-mono text-muted-foreground mt-2">
									{article.category && (
										<span>CATEGORY: {article.category.name}</span>
									)}
									<time className="ml-auto">
										{article.createdAt.toLocaleDateString("zh-CN")}
									</time>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
