import { Link } from "@tanstack/react-router";
import { useUserArticlesQuery } from "../../-hooks/use-user-articles-query";

type UserDraftArticlesProps = {
	userId: number;
};

export function UserDraftArticles({ userId }: UserDraftArticlesProps) {
	const { data: articles } = useUserArticlesQuery(userId);

	const draftArticles = articles?.filter((a) => a.status === "draft") ?? [];

	if (draftArticles.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 border-foreground border-b-2 pb-2">
				<div className="h-2 w-2 rounded-full border border-foreground bg-yellow-500" />
				<h2 className="font-bold font-mono text-xl uppercase">Drafts</h2>
			</div>

			<div className="space-y-3">
				{draftArticles.map((article) => (
					<div
						className="rounded-sm border-2 border-foreground bg-accent/10 p-4 transition-colors hover:bg-accent/20"
						key={article.id}
					>
						<div className="flex items-start gap-3">
							<span className="mt-1 shrink-0 rounded-sm border border-yellow-800 bg-yellow-100 px-2 py-0.5 font-mono text-[10px] text-yellow-800 uppercase">
								Draft
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
								<div className="mt-2 font-mono text-muted-foreground text-xs">
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
