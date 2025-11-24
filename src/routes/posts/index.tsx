import { createFileRoute } from "@tanstack/react-router";
import { ArticleList } from "./-components/ArticleList";
import { useArticlesQuery } from "./-hooks/useArticlesQuery";

export const Route = createFileRoute("/posts/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { data: articles } = useArticlesQuery();

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<h1 className="text-3xl font-bold">文章列表</h1>
			<ArticleList articles={articles} />
		</div>
	);
}
