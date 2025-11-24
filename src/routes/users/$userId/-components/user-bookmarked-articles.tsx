import { Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { useUserBookmarkedArticlesQuery } from "../-hooks/use-user-bookmarked-articles-query";

type UserBookmarkedArticlesProps = {
	userId: number;
};

export function UserBookmarkedArticles({
	userId,
}: UserBookmarkedArticlesProps) {
	const { data: articles } = useUserBookmarkedArticlesQuery(userId);

	if (!articles || articles.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 border-foreground border-b-2 pb-2 text-primary">
				<Bookmark className="h-5 w-5 fill-current" />
				<h2 className="font-bold font-mono text-foreground text-xl uppercase">
					Bookmarks
				</h2>
			</div>
			<div className="space-y-3">
				{articles.map((article) => (
					<div
						className="hover:-translate-y-1 rounded-sm border-2 border-foreground bg-white p-4 transition-all hover:shadow-[4px_4px_0px_0px_var(--foreground)]"
						key={article.id}
					>
						<Link
							className="block"
							params={{ articleId: String(article.id) }}
							to="/articles/$articleId"
						>
							<h3 className="mb-2 font-bold font-mono text-foreground text-lg transition-colors hover:text-primary">
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
									className="font-bold uppercase hover:text-primary"
									params={{ userId: String(article.author.id) }}
									to="/users/$userId"
								>
									{article.author.displayName}
								</Link>
							)}
							<span className="ml-auto">
								Saved: {article.bookmarkedAt.toLocaleDateString("zh-CN")}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
