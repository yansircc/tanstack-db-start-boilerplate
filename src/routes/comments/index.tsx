import { createFileRoute } from "@tanstack/react-router";
import { CommentList } from "./-components/CommentList";

export const Route = createFileRoute("/comments/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-[1280px] mx-auto p-8 space-y-8">
			<div className="border-b-2 border-foreground pb-4">
				<h1 className="text-6xl font-bold tracking-tight uppercase font-mono">
					Comments
				</h1>
				<p className="text-lg text-muted-foreground font-mono mt-2">
					Latest community discussions.
				</p>
			</div>
			<CommentList />
		</div>
	);
}
