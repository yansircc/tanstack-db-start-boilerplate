import { useCategoryArticlesQuery } from "../../-hooks/use-category-articles-query";
import { useCategoryQuery } from "../../-hooks/use-category-query";

type CategoryHeaderProps = {
	categoryId: number;
};

export function CategoryHeader({ categoryId }: CategoryHeaderProps) {
	const { data: category } = useCategoryQuery(categoryId);
	const { data: articles } = useCategoryArticlesQuery(categoryId);

	if (!category) {
		return (
			<div className="rounded-sm border-2 border-foreground border-dashed p-12 text-center font-mono text-muted-foreground uppercase">
				Category not found
			</div>
		);
	}

	const totalArticles = articles?.length ?? 0;
	const totalViews =
		articles?.reduce((sum, article) => sum + (article?.viewCount ?? 0), 0) ?? 0;

	return (
		<div className="rounded-sm border-2 border-foreground bg-white p-8 shadow-[8px_8px_0px_0px_var(--foreground)]">
			<div className="flex items-start gap-6">
				<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border-2 border-foreground bg-secondary font-bold font-mono text-3xl text-foreground">
					{category.name[0].toUpperCase()}
				</div>
				<div className="flex-1">
					<h1 className="font-bold font-mono text-5xl text-foreground uppercase tracking-tight">
						{category.name}
					</h1>
					<p className="mt-1 font-mono text-lg text-muted-foreground">
						#{category.slug}
					</p>

					{category.description && (
						<p className="mt-4 max-w-2xl border-primary border-l-4 pl-4 text-foreground text-lg leading-relaxed">
							{category.description}
						</p>
					)}
				</div>
			</div>

			<div className="mt-6 flex items-center gap-8 border-foreground/10 border-t-2 pt-6">
				<div className="flex flex-col">
					<span className="font-bold font-mono text-muted-foreground text-xs uppercase">
						Articles
					</span>
					<span className="font-bold font-mono text-2xl">{totalArticles}</span>
				</div>
				<div className="flex flex-col">
					<span className="font-bold font-mono text-muted-foreground text-xs uppercase">
						Total Views
					</span>
					<span className="font-bold font-mono text-2xl">{totalViews}</span>
				</div>
				<div className="ml-auto flex flex-col text-right">
					<span className="font-bold font-mono text-muted-foreground text-xs uppercase">
						Created
					</span>
					<span className="font-mono text-lg">
						{category.createdAt.toLocaleDateString("zh-CN")}
					</span>
				</div>
			</div>
		</div>
	);
}
