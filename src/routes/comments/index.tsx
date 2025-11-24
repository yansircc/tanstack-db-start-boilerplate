import { createFileRoute } from "@tanstack/react-router";
import { CommentList } from "./-components/CommentList";

export const Route = createFileRoute("/comments/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<h1 className="text-3xl font-bold">评论列表</h1>
			<CommentList />
		</div>
	);
}
