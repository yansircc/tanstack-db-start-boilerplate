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
			className="inline-flex items-center px-4 py-2 rounded-sm border-2 border-foreground bg-white hover:bg-secondary transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--foreground)] active:translate-y-0 active:shadow-none group"
		>
			<span className="font-mono font-bold text-foreground group-hover:text-foreground">#{tag.name}</span>
		</Link>
	);
}
