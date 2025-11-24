import { useTagArticlesQuery } from "../../-hooks/useTagArticlesQuery";
import { useTagQuery } from "../../-hooks/useTagQuery";

interface TagHeaderProps {
	tagId: number;
}

export function TagHeader({ tagId }: TagHeaderProps) {
	const { data: tag } = useTagQuery(tagId);
	const { data: articles } = useTagArticlesQuery(tagId);

	if (!tag) {
		return (
			<div className="border-2 border-foreground border-dashed rounded-sm p-12 text-center">
				<div className="text-muted-foreground font-mono uppercase">Tag not found</div>
			</div>
		);
	}

	const totalArticles = articles?.length ?? 0;
	const totalViews =
		articles?.reduce((sum, article) => sum + (article?.viewCount ?? 0), 0) ?? 0;

	return (
		<div className="border-2 border-foreground rounded-sm p-8 bg-white shadow-[8px_8px_0px_0px_var(--foreground)]">
			<div className="flex items-start justify-between">
				<div className="flex items-start gap-4">
					<div className="bg-primary text-primary-foreground border-2 border-foreground px-4 py-2 rounded-sm text-3xl font-bold font-mono">
						#
					</div>
					<div>
						<h1 className="text-5xl font-bold font-mono text-foreground uppercase tracking-tight">
							{tag.name}
						</h1>
						<p className="text-muted-foreground font-mono mt-1 text-lg">slug: {tag.slug}</p>
					</div>
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
			</div>
		</div>
	);
}
