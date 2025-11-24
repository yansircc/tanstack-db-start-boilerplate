import { useState } from "react";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
	useArticlesQuery,
	useArticlesTotalQuery,
} from "../-hooks/use-articles-query";
import { useCategoriesSimpleQuery } from "../-hooks/use-categories-simple-query";
import { ArticleCard } from "./article-card";
import { DeleteArticleDialog } from "./delete-article-dialog";
import { EditArticleDialog } from "./edit-article-dialog";

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
		return (
			<div className="rounded-sm border-2 border-foreground border-dashed p-12 text-center">
				<p className="font-mono text-lg text-muted-foreground uppercase">
					No articles found.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				{articles.map((article) => {
					// 只有文章作者可以编辑和删除
					const isAuthor = userId === article.author?.id;

					return (
						<div
							className="hover:-translate-y-1 group rounded-sm border-2 border-foreground bg-white p-6 transition-all duration-200 hover:shadow-[4px_4px_0px_0px_var(--foreground)]"
							key={article.id}
						>
							<div className="flex items-start justify-between gap-6">
								<ArticleCard article={article} />
								{isAuthor && (
									<div className="flex shrink-0 flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
										<EditArticleDialog
											articleId={article.id}
											authorId={userId ?? 0}
											categories={categories ?? []}
											trigger={
												<Button className="w-full" size="sm" variant="outline">
													Edit
												</Button>
											}
										/>
										<DeleteArticleDialog
											articleId={article.id}
											trigger={
												<Button
													className="w-full"
													size="sm"
													variant="destructive"
												>
													Delete
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
				itemsPerPage={itemsPerPage}
				onPageChange={setCurrentPage}
				totalItems={totalCount}
			/>
		</div>
	);
}
