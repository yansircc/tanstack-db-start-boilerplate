import { useTagArticlesQuery } from "../../-hooks/use-tag-articles-query";
import { useTagQuery } from "../../-hooks/use-tag-query";

type TagHeaderProps = {
	tagId: number;
};

export function TagHeader({ tagId }: TagHeaderProps) {
	const { data: tag } = useTagQuery(tagId);
	const { data: articles } = useTagArticlesQuery(tagId);

	if (!tag) {
		return (
			<div className="rounded-sm border-2 border-foreground border-dashed p-12 text-center">
				<div className="font-mono text-muted-foreground uppercase">
					Tag not found
				</div>
			</div>
		);
	}

	const totalArticles = articles?.length ?? 0;
	const totalViews =
		articles?.reduce((sum, article) => sum + (article?.viewCount ?? 0), 0) ?? 0;

	return (
		<div className="rounded-sm border-2 border-foreground bg-white p-8 shadow-[8px_8px_0px_0px_var(--foreground)]">
			<div className="flex items-start justify-between">
				<div className="flex items-start gap-4">
					<div className="rounded-sm border-2 border-foreground bg-primary px-4 py-2 font-bold font-mono text-3xl text-primary-foreground">
						#
					</div>
					<div>
						<h1 className="font-bold font-mono text-5xl text-foreground uppercase tracking-tight">
							{tag.name}
						</h1>
						<p className="mt-1 font-mono text-lg text-muted-foreground">
							slug: {tag.slug}
						</p>
					</div>
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
			</div>
		</div>
	);
}
