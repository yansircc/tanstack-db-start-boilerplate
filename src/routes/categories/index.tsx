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
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">分类列表</h1>
				<CreateCategoryDialog trigger={<Button>创建分类</Button>} />
			</div>
			<CategoryList />
		</div>
	);
}
