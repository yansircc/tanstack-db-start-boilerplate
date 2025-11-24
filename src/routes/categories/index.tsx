import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CategoryList } from "./-components/category-list";
import { CreateCategoryDialog } from "./-components/create-category-dialog";

export const Route = createFileRoute("/categories/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mx-auto max-w-[1280px] space-y-8 p-8">
			<div className="flex items-end justify-between border-foreground border-b-2 pb-4">
				<div>
					<h1 className="font-bold font-mono text-6xl uppercase tracking-tight">
						Categories
					</h1>
					<p className="mt-2 font-mono text-lg text-muted-foreground">
						Organize your content structure.
					</p>
				</div>
				<CreateCategoryDialog trigger={<Button>Create Category</Button>} />
			</div>
			<CategoryList />
		</div>
	);
}
