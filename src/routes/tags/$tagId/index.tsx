import { createFileRoute } from "@tanstack/react-router";
import { TagArticles } from "./-components/TagArticles";
import { TagHeader } from "./-components/TagHeader";

export const Route = createFileRoute("/tags/$tagId/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { tagId } = Route.useParams();
	const tagIdNum = Number(tagId);

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<TagHeader tagId={tagIdNum} />
			<TagArticles tagId={tagIdNum} />
		</div>
	);
}
