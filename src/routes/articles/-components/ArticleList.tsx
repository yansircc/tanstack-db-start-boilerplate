import { Button } from "@/components/ui/button";
import { useArticlesQuery } from "../-hooks/useArticlesQuery";
import { ArticleCard } from "./ArticleCard";
import { DeleteArticleDialog } from "./DeleteArticleDialog";
import { EditArticleDialog } from "./EditArticleDialog";

export function ArticleList() {
	const { data: articles } = useArticlesQuery();

	// TODO: 从当前用户获取 authorId 和 categories
	const authorId = 1;
	const categories = [
		{ id: 1, name: "技术" },
		{ id: 2, name: "生活" },
	];

	if (!articles || articles.length === 0) {
		return <p className="text-gray-500">暂无文章</p>;
	}

	return (
		<div className="space-y-4">
			{articles.map((article) => (
				<div
					key={article.id}
					className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
				>
					<div className="flex items-start justify-between gap-4">
						<ArticleCard article={article} />
						<div className="flex gap-2 flex-shrink-0">
							<EditArticleDialog
								article={article}
								authorId={authorId}
								categories={categories}
								trigger={
									<Button size="sm" variant="outline">
										编辑
									</Button>
								}
							/>
							<DeleteArticleDialog
								article={article}
								trigger={
									<Button size="sm" variant="destructive">
										删除
									</Button>
								}
							/>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
