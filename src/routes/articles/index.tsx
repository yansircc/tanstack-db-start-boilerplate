import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArticleList } from "./-components/ArticleList";
import { CreateArticleDialog } from "./-components/CreateArticleDialog";

export const Route = createFileRoute("/articles/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	// TODO: 从当前用户获取 authorId 和 categories
	const authorId = 1; // 临时硬编码
	const categories = [
		{ id: 1, name: "技术" },
		{ id: 2, name: "生活" },
	]; // 临时数据

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">文章列表</h1>
				<CreateArticleDialog
					authorId={authorId}
					categories={categories}
					trigger={<Button>创建文章</Button>}
				/>
			</div>
			<ArticleList />
		</div>
	);
}
