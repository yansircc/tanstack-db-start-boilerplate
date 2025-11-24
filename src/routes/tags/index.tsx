import { createFileRoute } from "@tanstack/react-router";
import { TagList } from "./-components/TagList";
import { useTagsQuery } from "./-hooks/useTagsQuery";

export const Route = createFileRoute("/tags/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { data: tags } = useTagsQuery();

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<h1 className="text-3xl font-bold">标签列表</h1>
			<TagList tags={tags} />
		</div>
	);
}
