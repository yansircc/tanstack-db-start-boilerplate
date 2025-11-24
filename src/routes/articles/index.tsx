import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ArticleList } from "./-components/ArticleList";
import { CreateArticleDialog } from "./-components/CreateArticleDialog";
import { useCategoriesSimpleQuery } from "./-hooks/useCategoriesSimpleQuery";

export const Route = createFileRoute("/articles/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { userId, isLoggedIn } = useCurrentUser();
	const { data: categories } = useCategoriesSimpleQuery();

	return (
		<div className="max-w-[1280px] mx-auto p-8 space-y-8">
			<div className="flex items-end justify-between border-b-2 border-foreground pb-4">
				<div>
					<h1 className="text-6xl font-bold tracking-tight uppercase font-mono">
						Articles
					</h1>
					<p className="text-lg text-muted-foreground font-mono mt-2">
						Browse and manage your articles.
					</p>
				</div>
				{isLoggedIn ? (
					<CreateArticleDialog
						authorId={userId ?? 0}
						categories={categories ?? []}
						trigger={<Button>Create Article</Button>}
					/>
				) : (
					<Button disabled title="Login required" className="opacity-50">
						Login to Create
					</Button>
				)}
			</div>
			<ArticleList />
		</div>
	);
}
