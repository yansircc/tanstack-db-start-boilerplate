import { createFileRoute } from "@tanstack/react-router";
import { CommentList } from "./-components/comment-list";

export const Route = createFileRoute("/comments/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mx-auto max-w-[1280px] space-y-8 p-8">
			<div className="border-foreground border-b-2 pb-4">
				<h1 className="font-bold font-mono text-6xl uppercase tracking-tight">
					Comments
				</h1>
				<p className="mt-2 font-mono text-lg text-muted-foreground">
					Latest community discussions.
				</p>
			</div>
			<CommentList />
		</div>
	);
}
