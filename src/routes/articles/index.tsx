import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ArticleList } from "./-components/article-list";
import { CreateArticleDialog } from "./-components/create-article-dialog";
import { useCategoriesSimpleQuery } from "./-hooks/use-categories-simple-query";

export const Route = createFileRoute("/articles/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { userId, isLoggedIn } = useCurrentUser();
	const { data: categories } = useCategoriesSimpleQuery();

	return (
		<div className="mx-auto max-w-[1280px] space-y-8 p-8">
			<div className="flex items-end justify-between border-foreground border-b-2 pb-4">
				<div>
					<h1 className="font-bold font-mono text-6xl uppercase tracking-tight">
						Articles
					</h1>
					<p className="mt-2 font-mono text-lg text-muted-foreground">
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
					<Button className="opacity-50" disabled title="Login required">
						Login to Create
					</Button>
				)}
			</div>
			<ArticleList />
		</div>
	);
}
