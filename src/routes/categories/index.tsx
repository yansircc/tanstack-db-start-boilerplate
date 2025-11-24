import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CategoryList } from "./-components/CategoryList";
import { CreateCategoryDialog } from "./-components/CreateCategoryDialog";

export const Route = createFileRoute("/categories/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-[1280px] mx-auto p-8 space-y-8">
			<div className="flex items-end justify-between border-b-2 border-foreground pb-4">
				<div>
					<h1 className="text-6xl font-bold tracking-tight uppercase font-mono">
						Categories
					</h1>
					<p className="text-lg text-muted-foreground font-mono mt-2">
						Organize your content structure.
					</p>
				</div>
				<CreateCategoryDialog trigger={<Button>Create Category</Button>} />
			</div>
			<CategoryList />
		</div>
	);
}
