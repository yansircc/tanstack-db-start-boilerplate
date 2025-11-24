import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";
import type { CategoryWithCount } from "./types";

type CategoryCardProps = {
	category: CategoryWithCount;
};

export function CategoryCard({ category }: CategoryCardProps) {
	// Simple color cycle based on ID
	const colors = ["bg-primary/10", "bg-secondary/20", "bg-accent/20"];
	const bgClass = colors[category.id % colors.length];

	return (
		<div
			className={`rounded-sm border-2 border-foreground p-6 ${bgClass} hover:-translate-y-1 group flex h-full flex-col transition-all duration-200 hover:shadow-[4px_4px_0px_0px_var(--foreground)]`}
		>
			<div className="mb-4 flex items-start justify-between gap-4">
				<Link
					className="flex-1"
					params={{ categoryId: String(category.id) }}
					to="/categories/$categoryId"
				>
					<h3 className="truncate font-bold font-mono text-xl uppercase transition-colors hover:text-primary">
						{category.name}
					</h3>
				</Link>

				<div className="flex shrink-0 gap-2 opacity-0 transition-opacity group-hover:opacity-100">
					<EditCategoryDialog
						categoryId={category.id}
						trigger={
							<Button className="h-6 w-6 p-0" size="sm" variant="outline">
								✎
							</Button>
						}
					/>
					<DeleteCategoryDialog
						categoryId={category.id}
						trigger={
							<Button className="h-6 w-6 p-0" size="sm" variant="destructive">
								×
							</Button>
						}
					/>
				</div>
			</div>

			{category.description && (
				<p className="mb-6 line-clamp-3 flex-1 text-foreground/80 text-sm">
					{category.description}
				</p>
			)}

			<div className="mt-auto flex items-center justify-between border-foreground/10 border-t-2 pt-3 font-mono text-xs">
				<span className="font-bold">{category.articleCount} ARTICLES</span>
				<span className="text-muted-foreground">#{category.slug}</span>
			</div>
		</div>
	);
}
