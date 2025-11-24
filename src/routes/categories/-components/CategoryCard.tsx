import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { EditCategoryDialog } from "./EditCategoryDialog";
import type { CategoryWithCount } from "./types";

interface CategoryCardProps {
	category: CategoryWithCount;
}

export function CategoryCard({ category }: CategoryCardProps) {
	// Simple color cycle based on ID
	const colors = ["bg-primary/10", "bg-secondary/20", "bg-accent/20"];
	const bgClass = colors[category.id % colors.length];

	return (
		<div className={`border-2 border-foreground rounded-sm p-6 ${bgClass} hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--foreground)] transition-all duration-200 flex flex-col h-full group`}>
			<div className="flex items-start justify-between gap-4 mb-4">
				<Link
					to="/categories/$categoryId"
					params={{ categoryId: String(category.id) }}
					className="flex-1"
				>
					<h3 className="text-xl font-bold font-mono uppercase truncate hover:text-primary transition-colors">
						{category.name}
					</h3>
				</Link>

				<div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
					<EditCategoryDialog
						categoryId={category.id}
						trigger={
							<Button size="sm" variant="outline" className="h-6 w-6 p-0">
								✎
							</Button>
						}
					/>
					<DeleteCategoryDialog
						categoryId={category.id}
						trigger={
							<Button size="sm" variant="destructive" className="h-6 w-6 p-0">
								×
							</Button>
						}
					/>
				</div>
			</div>

			{category.description && (
				<p className="text-sm text-foreground/80 mb-6 flex-1 line-clamp-3">{category.description}</p>
			)}

			<div className="flex items-center justify-between text-xs font-mono border-t-2 border-foreground/10 pt-3 mt-auto">
				<span className="font-bold">{category.articleCount} ARTICLES</span>
				<span className="text-muted-foreground">#{category.slug}</span>
			</div>
		</div>
	);
}
