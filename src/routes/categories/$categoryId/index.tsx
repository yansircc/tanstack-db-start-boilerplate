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
		<div className="max-w-[1280px] mx-auto p-8 space-y-8">
			<CategoryHeader categoryId={categoryIdNum} />
			<CategoryArticles categoryId={categoryIdNum} />
		</div>
	);
}
