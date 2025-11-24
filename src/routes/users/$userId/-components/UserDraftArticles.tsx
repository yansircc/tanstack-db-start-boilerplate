import { Link } from "@tanstack/react-router";
import { useUserArticlesQuery } from "../../-hooks/useUserArticlesQuery";

interface UserDraftArticlesProps {
	userId: number;
}

export function UserDraftArticles({ userId }: UserDraftArticlesProps) {
	const { data: articles } = useUserArticlesQuery(userId);

	const draftArticles = articles?.filter((a) => a.status === "draft") ?? [];

	if (draftArticles.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold text-gray-900">草稿</h2>
			<div className="space-y-3">
				{draftArticles.map((article) => (
					<div
						key={article.id}
						className="border border-gray-200 rounded-lg p-4 bg-gray-50"
					>
						<div className="flex items-start gap-2">
							<span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
								草稿
							</span>
							<div className="flex-1">
								<Link
									to="/articles/$articleId"
									params={{ articleId: String(article.id) }}
								>
									<h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
										{article.title}
									</h3>
								</Link>
								{article.excerpt && (
									<p className="text-gray-600 text-sm mt-1">
										{article.excerpt}
									</p>
								)}
								<div className="text-xs text-gray-500 mt-2">
									{article.createdAt.toLocaleDateString("zh-CN")}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
