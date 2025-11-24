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
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">文章列表</h1>
				{isLoggedIn ? (
					<CreateArticleDialog
						authorId={userId ?? 0}
						categories={categories ?? []}
						trigger={<Button>创建文章</Button>}
					/>
				) : (
					<Button disabled title="请先登录">
						创建文章
					</Button>
				)}
			</div>
			<ArticleList />
		</div>
	);
}
