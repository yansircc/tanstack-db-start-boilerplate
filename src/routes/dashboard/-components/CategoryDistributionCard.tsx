import { Link } from "@tanstack/react-router";
import { useCategoryStatsQuery } from "../-hooks/useCategoryStatsQuery";

export function CategoryDistributionCard() {
	const { data: categories } = useCategoryStatsQuery();

	return (
		<div className="border-2 border-foreground rounded-sm bg-white p-0 overflow-hidden flex flex-col h-full">
			<div className="bg-muted/50 p-4 border-b-2 border-foreground flex items-center justify-between">
				<h2 className="text-lg font-mono font-bold uppercase">Distribution</h2>
				<div className="w-3 h-3 border-2 border-foreground bg-accent"></div>
			</div>
			
			{!categories || categories.length === 0 ? (
				<div className="p-8 text-center text-muted-foreground font-mono">NO DATA FOUND</div>
			) : (
				<div className="p-4 space-y-3 flex-1">
					{categories.map((cat, i) => (
						<Link
							key={cat.categoryId}
							to="/categories/$categoryId"
							params={{ categoryId: String(cat.categoryId) }}
							className="block group"
						>
							<div className="flex items-end justify-between mb-1">
								<span className="text-sm font-bold font-mono group-hover:text-primary transition-colors">
									{cat.categoryName}
								</span>
								<span className="text-xs font-mono text-foreground">
									{cat.articleCount}
								</span>
							</div>
							<div className="h-3 w-full border-2 border-foreground bg-muted rounded-sm overflow-hidden relative">
								<div
									className="h-full absolute top-0 left-0 border-r-2 border-foreground transition-all duration-500 ease-out"
									style={{
										width: `${Math.min((cat.articleCount / (categories[0]?.articleCount || 1)) * 100, 100)}%`,
										backgroundColor: i % 3 === 0 ? 'var(--primary)' : i % 3 === 1 ? 'var(--secondary)' : 'var(--accent)'
									}}
								/>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
