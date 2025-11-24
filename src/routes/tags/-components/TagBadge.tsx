import { Link } from "@tanstack/react-router";
import type { TagDisplay } from "./types";

interface TagBadgeProps {
	tag: TagDisplay;
}

export function TagBadge({ tag }: TagBadgeProps) {
	return (
		<Link
			to="/tags/$tagId"
			params={{ tagId: String(tag.id) }}
			className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
		>
			<span className="font-medium">#{tag.name}</span>
		</Link>
	);
}
