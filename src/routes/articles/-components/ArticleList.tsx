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
		return (
			<div className="border-2 border-foreground border-dashed rounded-sm p-12 text-center">
				<p className="text-muted-foreground font-mono text-lg uppercase">No articles found.</p>
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
							key={article.id}
							className="border-2 border-foreground rounded-sm p-6 bg-white hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_var(--foreground)] transition-all duration-200 group"
						>
							<div className="flex items-start justify-between gap-6">
								<ArticleCard article={article} />
								{isAuthor && (
									<div className="flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
										<EditArticleDialog
											articleId={article.id}
											authorId={userId ?? 0}
											categories={categories ?? []}
											trigger={
												<Button size="sm" variant="outline" className="w-full">
													Edit
												</Button>
											}
										/>
										<DeleteArticleDialog
											articleId={article.id}
											trigger={
												<Button size="sm" variant="destructive" className="w-full">
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
				totalItems={totalCount}
				itemsPerPage={itemsPerPage}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}
