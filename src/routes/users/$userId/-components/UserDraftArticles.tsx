import { Link } from "@tanstack/react-router";
import { useUserArticlesQuery } from "../../-hooks/useUserArticlesQuery";

interface UserDraftArticlesProps {
	userId: number;
}

export function UserDraftArticles({ userId }: UserDraftArticlesProps) {
	const { data: articles } = useUserArticlesQuery(userId);

	const draftArticles = articles?.filter((a) => a.status === "draft") ?? [];

	if (draftArticles.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 border-b-2 border-foreground pb-2">
				<div className="w-2 h-2 rounded-full bg-yellow-500 border border-foreground"></div>
				<h2 className="text-xl font-bold font-mono uppercase">Drafts</h2>
			</div>

			<div className="space-y-3">
				{draftArticles.map((article) => (
					<div
						key={article.id}
						className="border-2 border-foreground rounded-sm p-4 bg-accent/10 hover:bg-accent/20 transition-colors"
					>
						<div className="flex items-start gap-3">
							<span className="bg-yellow-100 text-yellow-800 border border-yellow-800 font-mono text-[10px] uppercase px-2 py-0.5 rounded-sm shrink-0 mt-1">
								Draft
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
								<div className="text-xs font-mono text-muted-foreground mt-2">
									CREATED: {article.createdAt.toLocaleDateString("zh-CN")}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
