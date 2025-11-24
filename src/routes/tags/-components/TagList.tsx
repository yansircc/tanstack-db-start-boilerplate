import { useTagsQuery } from "../-hooks/useTagsQuery";
import { TagBadge } from "./TagBadge";

export function TagList() {
	const { data: tags } = useTagsQuery();

	if (!tags || tags.length === 0) {
		return (
			<div className="border-2 border-foreground border-dashed rounded-sm p-12 text-center">
				<p className="text-muted-foreground font-mono text-lg uppercase">
					No tags found.
				</p>
				<p className="text-sm text-muted-foreground mt-2">
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
