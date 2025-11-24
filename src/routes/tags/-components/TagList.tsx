import { TagBadge } from "./TagBadge";
import type { TagDisplay } from "./types";

interface TagListProps {
	tags: TagDisplay[] | undefined;
}

export function TagList({ tags }: TagListProps) {
	if (!tags || tags.length === 0) {
		return <p className="text-gray-500">暂无标签</p>;
	}

	return (
		<div className="flex flex-wrap gap-3">
			{tags.map((tag) => (
				<TagBadge key={tag.id} tag={tag} />
			))}
		</div>
	);
}
