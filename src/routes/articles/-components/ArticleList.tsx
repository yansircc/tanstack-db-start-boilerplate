import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useArticlesQuery } from "../-hooks/useArticlesQuery";
import { useCategoriesSimpleQuery } from "../-hooks/useCategoriesSimpleQuery";
import { ArticleCard } from "./ArticleCard";
import { DeleteArticleDialog } from "./DeleteArticleDialog";
import { EditArticleDialog } from "./EditArticleDialog";

export function ArticleList() {
	const { data: articles } = useArticlesQuery();
	const { userId } = useCurrentUser();
	const { data: categories } = useCategoriesSimpleQuery();

	if (!articles || articles.length === 0) {
		return <p className="text-gray-500">暂无文章</p>;
	}

	return (
		<div className="space-y-4">
			{articles.map((article) => {
				// 只有文章作者可以编辑和删除
				const isAuthor = userId === article.author?.id;

				return (
					<div
						key={article.id}
						className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
					>
						<div className="flex items-start justify-between gap-4">
							<ArticleCard article={article} />
							{isAuthor && (
								<div className="flex gap-2 flex-shrink-0">
									<EditArticleDialog
										article={article}
										authorId={userId!}
										categories={categories ?? []}
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
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
