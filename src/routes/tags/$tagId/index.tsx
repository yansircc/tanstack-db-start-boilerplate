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
		<div className="max-w-[1280px] mx-auto p-8 space-y-8">
			<TagHeader tagId={tagIdNum} />
			<TagArticles tagId={tagIdNum} />
		</div>
	);
}
