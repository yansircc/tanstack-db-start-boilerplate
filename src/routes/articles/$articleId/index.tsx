import { createFileRoute } from "@tanstack/react-router";
import { ArticleComments } from "./-components/article-comments";
import { ArticleContent } from "./-components/article-content";
import { ArticleHeader } from "./-components/article-header";

export const Route = createFileRoute("/articles/$articleId/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { articleId } = Route.useParams();
	const articleIdNum = Number(articleId);

	return (
		<div className="mx-auto max-w-[1024px] space-y-12 p-8">
			<article className="space-y-8 rounded-sm border-2 border-foreground bg-white p-8 shadow-[8px_8px_0px_0px_var(--foreground)]">
				<ArticleHeader articleId={articleIdNum} />
				<div className="my-8 border-foreground/10 border-t-2" />
				<ArticleContent articleId={articleIdNum} />
			</article>

			<ArticleComments articleId={articleIdNum} />
		</div>
	);
}
