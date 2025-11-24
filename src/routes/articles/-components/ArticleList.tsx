import { useState } from "react";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
	useArticlesQuery,
	useArticlesTotalQuery,
} from "../-hooks/useArticlesQuery";
import { useCategoriesSimpleQuery } from "../-hooks/useCategoriesSimpleQuery";
import { ArticleCard } from "./ArticleCard";
import { DeleteArticleDialog } from "./DeleteArticleDialog";
import { EditArticleDialog } from "./EditArticleDialog";

export function ArticleList() {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const { data: articles } = useArticlesQuery({
		page: currentPage,
		limit: itemsPerPage,
	});
	const { data: totalArticles } = useArticlesTotalQuery();
	const { userId } = useCurrentUser();
	const { data: categories } = useCategoriesSimpleQuery();

	const totalCount = totalArticles?.length ?? 0;

	if (!articles || articles.length === 0) {
		return <p className="text-gray-500">暂无文章</p>;
	}

	return (
		<div className="space-y-4">
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
									<div className="flex gap-2 shrink-0">
										<EditArticleDialog
											articleId={article.id}
											authorId={userId ?? 0}
											categories={categories ?? []}
											trigger={
												<Button size="sm" variant="outline">
													编辑
												</Button>
											}
										/>
										<DeleteArticleDialog
											articleId={article.id}
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

			<Pagination
				currentPage={currentPage}
				totalItems={totalCount}
				itemsPerPage={itemsPerPage}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}
