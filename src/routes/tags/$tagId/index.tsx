import { createFileRoute } from "@tanstack/react-router";
import { TagArticles } from "./-components/tag-articles";
import { TagHeader } from "./-components/tag-header";

export const Route = createFileRoute("/tags/$tagId/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { tagId } = Route.useParams();
	const tagIdNum = Number(tagId);

	return (
		<div className="mx-auto max-w-[1280px] space-y-8 p-8">
			<TagHeader tagId={tagIdNum} />
			<TagArticles tagId={tagIdNum} />
		</div>
	);
}
