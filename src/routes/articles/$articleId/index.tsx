import { createFileRoute } from "@tanstack/react-router";
import { ArticleComments } from "./-components/ArticleComments";
import { ArticleContent } from "./-components/ArticleContent";
import { ArticleHeader } from "./-components/ArticleHeader";

export const Route = createFileRoute("/articles/$articleId/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { articleId } = Route.useParams();
	const articleIdNum = Number(articleId);

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<article className="space-y-6">
				<ArticleHeader articleId={articleIdNum} />
				<ArticleContent articleId={articleIdNum} />
			</article>

			<ArticleComments articleId={articleIdNum} />
		</div>
	);
}
