import { useUserArticlesQuery } from "../../-hooks/useUserArticlesQuery";
import { useUserCommentsCountQuery } from "../../-hooks/useUserCommentsCountQuery";
import { useUserQuery } from "../../-hooks/useUserQuery";

interface UserProfileCardProps {
	userId: number;
}

export function UserProfileCard({ userId }: UserProfileCardProps) {
	const { data: user } = useUserQuery(userId);
	const { data: articles } = useUserArticlesQuery(userId);
	const { data: comments } = useUserCommentsCountQuery(userId);

	if (!user) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="text-center text-gray-500">用户不存在</div>
			</div>
		);
	}

	const publishedCount =
		articles?.filter((a) => a.status === "published").length ?? 0;
	const totalComments = comments?.length ?? 0;

	return (
		<div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
			<div className="flex items-start gap-6">
				{user.avatar ? (
					<img
						src={user.avatar}
						alt={user.displayName}
						className="w-24 h-24 rounded-full"
					/>
				) : (
					<div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
						<span className="text-4xl text-gray-500">
							{user.displayName[0].toUpperCase()}
						</span>
					</div>
				)}

				<div className="flex-1">
					<h1 className="text-3xl font-bold text-gray-900">
						{user.displayName}
					</h1>
					<p className="text-gray-500 text-lg">@{user.username}</p>

					{user.bio && (
						<p className="text-gray-700 mt-3 leading-relaxed">{user.bio}</p>
					)}

					<div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
						<div>
							<span className="font-semibold text-gray-900">
								{publishedCount}
							</span>{" "}
							篇已发布文章
						</div>
						<div>
							<span className="font-semibold text-gray-900">
								{totalComments}
							</span>{" "}
							条评论
						</div>
						<div className="ml-auto text-xs">
							加入于 {user.createdAt.toLocaleDateString("zh-CN")}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
