import { ArticleCard } from "./ArticleCard";
import type { ArticleWithRelations } from "./types";

interface ArticleListProps {
	articles: ArticleWithRelations[] | undefined;
}

export function ArticleList({ articles }: ArticleListProps) {
	if (!articles || articles.length === 0) {
		return <p className="text-gray-500">暂无文章</p>;
	}

	return (
		<div className="space-y-4">
			{articles.map((article) => (
				<ArticleCard key={article.id} article={article} />
			))}
		</div>
	);
}
