import { createFileRoute } from "@tanstack/react-router";
import { ArticleList } from "./-components/ArticleList";

export const Route = createFileRoute("/articles/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<h1 className="text-3xl font-bold">文章列表</h1>
			<ArticleList />
		</div>
	);
}
