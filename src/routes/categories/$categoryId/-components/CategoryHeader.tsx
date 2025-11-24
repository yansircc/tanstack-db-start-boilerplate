import { useCategoryArticlesQuery } from "../../-hooks/useCategoryArticlesQuery";
import { useCategoryQuery } from "../../-hooks/useCategoryQuery";

interface CategoryHeaderProps {
	categoryId: number;
}

export function CategoryHeader({ categoryId }: CategoryHeaderProps) {
	const { data: category } = useCategoryQuery(categoryId);
	const { data: articles } = useCategoryArticlesQuery(categoryId);

	if (!category) {
		return (
			<div className="border-2 border-foreground border-dashed rounded-sm p-12 text-center text-muted-foreground font-mono uppercase">
				Category not found
			</div>
		);
	}

	const totalArticles = articles?.length ?? 0;
	const totalViews =
		articles?.reduce((sum, article) => sum + (article?.viewCount ?? 0), 0) ?? 0;

	return (
		<div className="border-2 border-foreground rounded-sm p-8 bg-white shadow-[8px_8px_0px_0px_var(--foreground)]">
			<div className="flex items-start gap-6">
				<div className="bg-secondary border-2 border-foreground w-16 h-16 flex items-center justify-center rounded-sm text-3xl font-bold font-mono text-foreground shrink-0">
					{category.name[0].toUpperCase()}
				</div>
				<div className="flex-1">
					<h1 className="text-5xl font-bold font-mono text-foreground uppercase tracking-tight">
						{category.name}
					</h1>
					<p className="text-muted-foreground font-mono text-lg mt-1">#{category.slug}</p>
					
					{category.description && (
						<p className="text-foreground text-lg mt-4 leading-relaxed max-w-2xl border-l-4 border-primary pl-4">
							{category.description}
						</p>
					)}
				</div>
			</div>

			<div className="flex items-center gap-8 border-t-2 border-foreground/10 pt-6 mt-6">
				<div className="flex flex-col">
					<span className="text-xs font-mono font-bold uppercase text-muted-foreground">Articles</span>
					<span className="text-2xl font-bold font-mono">{totalArticles}</span>
				</div>
				<div className="flex flex-col">
					<span className="text-xs font-mono font-bold uppercase text-muted-foreground">Total Views</span>
					<span className="text-2xl font-bold font-mono">{totalViews}</span>
				</div>
				<div className="flex flex-col ml-auto text-right">
					<span className="text-xs font-mono font-bold uppercase text-muted-foreground">Created</span>
					<span className="text-lg font-mono">{category.createdAt.toLocaleDateString("zh-CN")}</span>
				</div>
			</div>
		</div>
	);
}
