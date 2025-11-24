import { createFileRoute } from "@tanstack/react-router";
import { ArticleComments } from "./-components/ArticleComments";
import { ArticleContent } from "./-components/ArticleContent";
import { ArticleHeader } from "./-components/ArticleHeader";

export const Route = createFileRoute("/posts/$postId/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { postId } = Route.useParams();
	const postIdNum = Number(postId);

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<article className="space-y-6">
				<ArticleHeader postId={postIdNum} />
				<ArticleContent postId={postIdNum} />
			</article>

			<ArticleComments postId={postIdNum} />
		</div>
	);
}
