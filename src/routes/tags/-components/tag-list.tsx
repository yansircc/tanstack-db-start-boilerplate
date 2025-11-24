import { useTagsQuery } from "../-hooks/use-tags-query";
import { TagBadge } from "./tag-badge";

export function TagList() {
	const { data: tags } = useTagsQuery();

	if (!tags || tags.length === 0) {
		return (
			<div className="rounded-sm border-2 border-foreground border-dashed p-12 text-center">
				<p className="font-mono text-lg text-muted-foreground uppercase">
					No tags found.
				</p>
				<p className="mt-2 text-muted-foreground text-sm">
					Create a new tag to get started.
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-wrap gap-4">
			{tags.map((tag) => (
				<TagBadge key={tag.id} tag={tag} />
			))}
		</div>
	);
}
