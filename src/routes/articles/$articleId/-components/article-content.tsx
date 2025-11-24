import { useArticleDetailQuery } from "../../-hooks/use-article-detail-query";

type ArticleContentProps = {
	articleId: number;
};

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
					alt={article.title}
					className="h-[400px] w-full rounded-sm border-2 border-foreground object-cover"
					height={400}
					src={article.coverImage}
					width={400}
				/>
			)}

			{/* Content */}
			<div className="prose prose-lg max-w-none prose-img:rounded-sm prose-img:border-2 prose-img:border-foreground prose-headings:font-bold prose-headings:font-mono prose-headings:uppercase">
				<div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
					{article.content}
				</div>
			</div>
		</div>
	);
}
