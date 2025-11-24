import { Link } from "@tanstack/react-router";
import { useTopAuthorsQuery } from "../-hooks/use-top-authors-query";

export function TopAuthorsCard() {
	const { data: authors } = useTopAuthorsQuery();

	return (
		<div className="flex h-full flex-col overflow-hidden rounded-sm border-2 border-foreground bg-white p-0">
			<div className="flex items-center justify-between border-foreground border-b-2 bg-muted/50 p-4">
				<h2 className="font-bold font-mono text-lg uppercase">Top Authors</h2>
				<div className="flex gap-1">
					<div className="h-2 w-2 rounded-full bg-foreground/20" />
					<div className="h-2 w-2 rounded-full bg-foreground/20" />
				</div>
			</div>

			{!authors || authors.length === 0 ? (
				<div className="p-8 text-center font-mono text-muted-foreground">
					NO DATA FOUND
				</div>
			) : (
				<div className="flex-1 space-y-2 p-4">
					{authors.map((author, index) => (
						<Link
							className="group flex items-center gap-4 rounded-sm border border-transparent p-2 transition-all hover:border-foreground hover:bg-muted"
							key={author.authorId}
							params={{ userId: String(author.authorId) }}
							to="/users/$userId"
						>
							<span className="w-6 font-bold font-mono text-foreground/40 text-lg transition-colors group-hover:text-primary">
								#{index + 1}
							</span>
							{author.avatar ? (
								<img
									alt={author.authorName || ""}
									className="h-10 w-10 rounded-sm border border-foreground object-cover"
									height={40}
									src={author.avatar}
									width={40}
								/>
							) : (
								<div className="flex h-10 w-10 items-center justify-center rounded-sm border border-foreground bg-secondary">
									<span className="font-bold text-sm">
										{author.authorName?.[0]?.toUpperCase() || "?"}
									</span>
								</div>
							)}
							<div className="min-w-0 flex-1">
								<div className="truncate font-bold">
									{author.authorName || "Unknown"}
								</div>
								<div className="font-mono text-muted-foreground text-xs">
									{author.articleCount} ARTICLES
								</div>
							</div>
							<div className="font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
								→
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
