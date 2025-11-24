import { Link } from "@tanstack/react-router";
import { useUserArticlesQuery } from "../../-hooks/use-user-articles-query";

type UserArchivedArticlesProps = {
	userId: number;
};

export function UserArchivedArticles({ userId }: UserArchivedArticlesProps) {
	const { data: articles } = useUserArticlesQuery(userId);

	const archivedArticles =
		articles?.filter((a) => a.status === "archived") ?? [];

	if (archivedArticles.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 border-foreground border-b-2 pb-2">
				<div className="h-2 w-2 rounded-full border border-foreground bg-gray-500" />
				<h2 className="font-bold font-mono text-xl uppercase">Archived</h2>
			</div>

			<div className="space-y-3">
				{archivedArticles.map((article) => (
					<div
						className="rounded-sm border-2 border-foreground bg-muted/50 p-4 opacity-75 transition-opacity hover:opacity-100"
						key={article.id}
					>
						<div className="flex items-start gap-3">
							<span className="mt-1 shrink-0 rounded-sm border border-foreground/30 bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
								Archived
							</span>
							<div className="min-w-0 flex-1">
								<Link
									className="block"
									params={{ articleId: String(article.id) }}
									to="/articles/$articleId"
								>
									<h3 className="truncate font-bold font-mono text-foreground text-lg transition-colors hover:text-primary">
										{article.title}
									</h3>
								</Link>
								{article.excerpt && (
									<p className="mt-1 line-clamp-1 text-muted-foreground text-sm">
										{article.excerpt}
									</p>
								)}
								<div className="mt-2 flex items-center gap-4 font-mono text-muted-foreground text-xs">
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
