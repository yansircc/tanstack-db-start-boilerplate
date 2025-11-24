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
		<div className="space-y-8">
			{/* Cover Image */}
			{article.coverImage && (
				<img
					src={article.coverImage}
					alt={article.title}
					className="w-full h-[400px] object-cover rounded-sm border-2 border-foreground"
				/>
			)}

			{/* Content */}
			<div className="prose prose-lg max-w-none prose-headings:font-mono prose-headings:uppercase prose-headings:font-bold prose-img:rounded-sm prose-img:border-2 prose-img:border-foreground">
				<div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
					{article.content}
				</div>
			</div>
		</div>
	);
}
