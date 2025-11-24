import { createFileRoute } from "@tanstack/react-router";
import { CategoryArticles } from "./-components/CategoryArticles";
import { CategoryHeader } from "./-components/CategoryHeader";

export const Route = createFileRoute("/categories/$categoryId/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { categoryId } = Route.useParams();
	const categoryIdNum = Number(categoryId);

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<CategoryHeader categoryId={categoryIdNum} />
			<CategoryArticles categoryId={categoryIdNum} />
		</div>
	);
}
