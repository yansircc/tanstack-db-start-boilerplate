import { Link } from "@tanstack/react-router";
import { useArticleDetailQuery } from "../../-hooks/useArticleDetailQuery";
import { ArticleLikeButton } from "./ArticleLikeButton";
import { ArticleBookmarkButton } from "./ArticleBookmarkButton";

interface ArticleHeaderProps {
	articleId: number;
}

export function ArticleHeader({ articleId }: ArticleHeaderProps) {
	const { data: article } = useArticleDetailQuery(articleId);

	if (!article) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="text-center text-gray-500">文章不存在</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<h1 className="text-4xl font-bold text-gray-900">{article.title}</h1>

			<div className="flex items-center gap-4 text-sm text-gray-600">
				{article.author && (
					<Link
						to="/users/$userId"
						params={{ userId: String(article.author.id) }}
						className="flex items-center gap-2 hover:text-blue-600"
					>
						{article.author.avatar ? (
							<img
								src={article.author.avatar}
								alt={article.author.displayName}
								className="w-10 h-10 rounded-full"
							/>
						) : (
							<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
								<span className="text-lg text-gray-500">
									{article.author.displayName[0].toUpperCase()}
								</span>
							</div>
						)}
						<div>
							<div className="font-medium text-gray-900">
								{article.author.displayName}
							</div>
							<div className="text-xs text-gray-500">
								@{article.author.username}
							</div>
						</div>
					</Link>
				)}

				<div className="flex items-center gap-3 ml-auto">
					{article.category && (
						<Link
							to="/categories/$categoryId"
							params={{ categoryId: String(article.category.id) }}
							className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200"
						>
							{article.category.name}
						</Link>
					)}
					<span className="text-gray-500">阅读 {article.viewCount}</span>
				</div>
			</div>

			<div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-200 pt-4">
				<span>发布于 {article.createdAt.toLocaleString("zh-CN")}</span>
				{article.updatedAt.getTime() !== article.createdAt.getTime() && (
					<span>更新于 {article.updatedAt.toLocaleString("zh-CN")}</span>
				)}
			</div>

			{/* 点赞和收藏按钮 */}
			<div className="flex items-center gap-3 pt-4 border-t border-gray-200">
				<ArticleLikeButton articleId={articleId} />
				<ArticleBookmarkButton articleId={articleId} />
			</div>
		</div>
	);
}
