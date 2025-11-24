import { Link } from "@tanstack/react-router";
import type { TagDisplay } from "./types";

type TagBadgeProps = {
	tag: TagDisplay;
};

export function TagBadge({ tag }: TagBadgeProps) {
	return (
		<Link
			className="hover:-translate-y-1 group inline-flex items-center rounded-sm border-2 border-foreground bg-white px-4 py-2 transition-all duration-200 hover:bg-secondary hover:shadow-[4px_4px_0px_0px_var(--foreground)] active:translate-y-0 active:shadow-none"
			params={{ tagId: String(tag.id) }}
			to="/tags/$tagId"
		>
			<span className="font-bold font-mono text-foreground group-hover:text-foreground">
				#{tag.name}
			</span>
		</Link>
	);
}
