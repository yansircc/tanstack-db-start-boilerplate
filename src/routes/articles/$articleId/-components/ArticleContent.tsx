import { useArticleDetailQuery } from "../../-hooks/useArticleDetailQuery";

interface ArticleContentProps {
	articleId: number;
}

export function ArticleContent({ articleId }: ArticleContentProps) {
	const { data: article } = useArticleDetailQuery(articleId);

	if (!article) {
		return null;
	}

	return (
		<>
			{/* Cover Image */}
			{article.coverImage && (
				<img
					src={article.coverImage}
					alt={article.title}
					className="w-full h-64 object-cover rounded-lg"
				/>
			)}

			{/* Content */}
			<div className="prose prose-lg max-w-none">
				<div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
					{article.content}
				</div>
			</div>
		</>
	);
}
