import { Link } from "@tanstack/react-router";
import { useTopAuthorsQuery } from "../-hooks/useTopAuthorsQuery";

export function TopAuthorsCard() {
	const { data: authors } = useTopAuthorsQuery();

	return (
		<div className="border-2 border-foreground rounded-sm bg-white p-0 overflow-hidden flex flex-col h-full">
			<div className="bg-muted/50 p-4 border-b-2 border-foreground flex items-center justify-between">
				<h2 className="text-lg font-mono font-bold uppercase">Top Authors</h2>
				<div className="flex gap-1">
					<div className="w-2 h-2 rounded-full bg-foreground/20"></div>
					<div className="w-2 h-2 rounded-full bg-foreground/20"></div>
				</div>
			</div>
			
			{!authors || authors.length === 0 ? (
				<div className="p-8 text-center text-muted-foreground font-mono">NO DATA FOUND</div>
			) : (
				<div className="p-4 space-y-2 flex-1">
					{authors.map((author, index) => (
						<Link
							key={author.authorId}
							to="/users/$userId"
							params={{ userId: String(author.authorId) }}
							className="flex items-center gap-4 p-2 rounded-sm border border-transparent hover:border-foreground hover:bg-muted transition-all group"
						>
							<span className="text-lg font-mono font-bold text-foreground/40 w-6 group-hover:text-primary transition-colors">
								#{index + 1}
							</span>
							{author.avatar ? (
								<img
									src={author.avatar}
									alt={author.authorName || ""}
									className="w-10 h-10 rounded-sm border border-foreground object-cover"
								/>
							) : (
								<div className="w-10 h-10 rounded-sm bg-secondary border border-foreground flex items-center justify-center">
									<span className="text-sm font-bold">
										{author.authorName?.[0]?.toUpperCase() || "?"}
									</span>
								</div>
							)}
							<div className="flex-1 min-w-0">
								<div className="font-bold truncate">{author.authorName || "Unknown"}</div>
								<div className="text-xs font-mono text-muted-foreground">
									{author.articleCount} ARTICLES
								</div>
							</div>
							<div className="opacity-0 group-hover:opacity-100 transition-opacity text-primary font-bold">
								→
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
