import { createFileRoute } from "@tanstack/react-router";
import { CategoryArticles } from "./-components/category-articles";
import { CategoryHeader } from "./-components/category-header";

export const Route = createFileRoute("/categories/$categoryId/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { categoryId } = Route.useParams();
	const categoryIdNum = Number(categoryId);

	return (
		<div className="mx-auto max-w-[1280px] space-y-8 p-8">
			<CategoryHeader categoryId={categoryIdNum} />
			<CategoryArticles categoryId={categoryIdNum} />
		</div>
	);
}
