import { Link } from "@tanstack/react-router";
import { useCategoryStatsQuery } from "../-hooks/use-category-stats-query";

// Helper function to get bar color based on index
const getBarColor = (index: number): string => {
	const remainder = index % 3;
	if (remainder === 0) {
		return "var(--primary)";
	}
	if (remainder === 1) {
		return "var(--secondary)";
	}
	return "var(--accent)";
};

export function CategoryDistributionCard() {
	const { data: categories } = useCategoryStatsQuery();

	return (
		<div className="flex h-full flex-col overflow-hidden rounded-sm border-2 border-foreground bg-white p-0">
			<div className="flex items-center justify-between border-foreground border-b-2 bg-muted/50 p-4">
				<h2 className="font-bold font-mono text-lg uppercase">Distribution</h2>
				<div className="h-3 w-3 border-2 border-foreground bg-accent" />
			</div>

			{!categories || categories.length === 0 ? (
				<div className="p-8 text-center font-mono text-muted-foreground">
					NO DATA FOUND
				</div>
			) : (
				<div className="flex-1 space-y-3 p-4">
					{categories.map((cat, i) => (
						<Link
							className="group block"
							key={cat.categoryId}
							params={{ categoryId: String(cat.categoryId) }}
							to="/categories/$categoryId"
						>
							<div className="mb-1 flex items-end justify-between">
								<span className="font-bold font-mono text-sm transition-colors group-hover:text-primary">
									{cat.categoryName}
								</span>
								<span className="font-mono text-foreground text-xs">
									{cat.articleCount}
								</span>
							</div>
							<div className="relative h-3 w-full overflow-hidden rounded-sm border-2 border-foreground bg-muted">
								<div
									className="absolute top-0 left-0 h-full border-foreground border-r-2 transition-all duration-500 ease-out"
									style={{
										width: `${Math.min((cat.articleCount / (categories[0]?.articleCount || 1)) * 100, 100)}%`,
										backgroundColor: getBarColor(i),
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
