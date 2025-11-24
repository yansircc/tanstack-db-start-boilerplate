import { useUserArticlesQuery } from "../../-hooks/useUserArticlesQuery";

interface UserStatsCardsProps {
	userId: number;
}

export function UserStatsCards({ userId }: UserStatsCardsProps) {
	const { data: articles } = useUserArticlesQuery(userId);

	const publishedArticles =
		articles?.filter((a) => a.status === "published") ?? [];
	const draftArticles = articles?.filter((a) => a.status === "draft") ?? [];

	return (
		<div className="grid grid-cols-3 gap-4">
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
				<div className="text-3xl font-bold text-blue-600">
					{articles?.length ?? 0}
				</div>
				<div className="text-sm text-gray-600">总文章数</div>
			</div>
			<div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
				<div className="text-3xl font-bold text-green-600">
					{publishedArticles.length}
				</div>
				<div className="text-sm text-gray-600">已发布</div>
			</div>
			<div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
				<div className="text-3xl font-bold text-orange-600">
					{draftArticles.length}
				</div>
				<div className="text-sm text-gray-600">草稿</div>
			</div>
		</div>
	);
}
