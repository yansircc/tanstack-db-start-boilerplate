import { useArticlesQuery } from "../-hooks/useArticlesQuery";
import { ArticleCard } from "./ArticleCard";

export function ArticleList() {
	const { data: articles } = useArticlesQuery();

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
