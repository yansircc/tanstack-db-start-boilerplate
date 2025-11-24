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
		<div className="max-w-[1024px] mx-auto p-8 space-y-12">
			<article className="space-y-8 bg-white border-2 border-foreground rounded-sm p-8 shadow-[8px_8px_0px_0px_var(--foreground)]">
				<ArticleHeader articleId={articleIdNum} />
				<div className="border-t-2 border-foreground/10 my-8"></div>
				<ArticleContent articleId={articleIdNum} />
			</article>

			<ArticleComments articleId={articleIdNum} />
		</div>
	);
}
