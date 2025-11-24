import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CreateTagDialog } from "./-components/CreateTagDialog";
import { TagList } from "./-components/TagList";

export const Route = createFileRoute("/tags/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">标签列表</h1>
				<CreateTagDialog trigger={<Button>创建标签</Button>} />
			</div>
			<TagList />
		</div>
	);
}
