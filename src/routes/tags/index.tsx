import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CreateTagDialog } from "./-components/create-tag-dialog";
import { TagList } from "./-components/tag-list";

export const Route = createFileRoute("/tags/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mx-auto max-w-[1280px] space-y-8 p-8">
			<div className="flex items-end justify-between border-foreground border-b-2 pb-4">
				<div>
					<h1 className="font-bold font-mono text-6xl uppercase tracking-tight">
						Tags
					</h1>
					<p className="mt-2 font-mono text-lg text-muted-foreground">
						Manage and view all content tags.
					</p>
				</div>
				<CreateTagDialog trigger={<Button>Create Tag</Button>} />
			</div>
			<TagList />
		</div>
	);
}
