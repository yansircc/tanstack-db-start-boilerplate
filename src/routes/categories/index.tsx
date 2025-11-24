import { createFileRoute } from "@tanstack/react-router";
import { CategoryList } from "./-components/CategoryList";

export const Route = createFileRoute("/categories/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<h1 className="text-3xl font-bold">分类列表</h1>
			<CategoryList />
		</div>
	);
}
