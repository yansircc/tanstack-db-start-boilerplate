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
		<div className="max-w-[1280px] mx-auto p-8 space-y-8">
			<div className="flex items-end justify-between border-b-2 border-foreground pb-4">
				<div>
					<h1 className="text-6xl font-bold tracking-tight uppercase font-mono">Tags</h1>
					<p className="text-lg text-muted-foreground font-mono mt-2">Manage and view all content tags.</p>
				</div>
				<CreateTagDialog trigger={<Button>Create Tag</Button>} />
			</div>
			<TagList />
		</div>
	);
}
