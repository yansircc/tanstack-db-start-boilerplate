import { Link } from "@tanstack/react-router";
import { useUserBookmarkedArticlesQuery } from "../-hooks/useUserBookmarkedArticlesQuery";
import { Bookmark } from "lucide-react";

interface UserBookmarkedArticlesProps {
	userId: number;
}

export function UserBookmarkedArticles({
	userId,
}: UserBookmarkedArticlesProps) {
	const { data: articles } = useUserBookmarkedArticlesQuery(userId);

	if (!articles || articles.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 border-b-2 border-foreground pb-2 text-primary">
				<Bookmark className="w-5 h-5 fill-current" />
				<h2 className="text-xl font-bold font-mono uppercase text-foreground">
					Bookmarks
				</h2>
			</div>
			<div className="space-y-3">
				{articles.map((article) => (
					<div
						key={article.id}
						className="border-2 border-foreground rounded-sm p-4 hover:shadow-[4px_4px_0px_0px_var(--foreground)] hover:-translate-y-1 transition-all bg-white"
					>
						<Link
							to="/articles/$articleId"
							params={{ articleId: String(article.id) }}
							className="block"
						>
							<h3 className="text-lg font-bold font-mono text-foreground mb-2 hover:text-primary transition-colors">
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
									className="hover:text-primary font-bold uppercase"
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
