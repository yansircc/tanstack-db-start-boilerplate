import { eq, useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import {
	articlesCollection,
	categoriesCollection,
	commentsCollection,
	usersCollection,
} from "../../../db/collections";

export const Route = createFileRoute("/users/$userId/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { userId } = Route.useParams();
	const userIdNum = Number(userId);

	// Get user info with findOne
	const { data: user } = useLiveQuery((q) =>
		q
			.from({ user: usersCollection })
			.where(({ user }) => eq(user.id, userIdNum))
			.select(({ user }) => ({
				id: user.id,
				username: user.username,
				displayName: user.displayName,
				email: user.email,
				avatar: user.avatar,
				bio: user.bio,
				createdAt: user.createdAt,
			}))
			.findOne(),
	);

	// Get user's articles
	const { data: articles } = useLiveQuery((q) =>
		q
			.from({ article: articlesCollection })
			.join(
				{ category: categoriesCollection },
				({ article, category }) => eq(article.categoryId, category.id),
				"left",
			)
			.where(({ article }) => eq(article.authorId, userIdNum))
			.orderBy(({ article }) => article.createdAt, "desc")
			.select(({ article, category }) => ({
				id: article.id,
				title: article.title,
				slug: article.slug,
				excerpt: article.excerpt,
				coverImage: article.coverImage,
				status: article.status,
				viewCount: article.viewCount,
				createdAt: article.createdAt,
				category: category,
			})),
	);

	// Get user's comments
	const { data: userComments } = useLiveQuery((q) =>
		q
			.from({ comment: commentsCollection })
			.where(({ comment }) => eq(comment.authorId, userIdNum))
			.select(({ comment }) => ({
				id: comment.id,
			})),
	);

	if (!user) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="text-center text-gray-500">用户不存在</div>
			</div>
		);
	}

	const totalComments = userComments?.length ?? 0;
	const publishedArticles = articles?.filter((a) => a.status === "published") ?? [];
	const draftArticles = articles?.filter((a) => a.status === "draft") ?? [];

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			{/* User Profile */}
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
									{publishedArticles.length}
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

			{/* Statistics Cards */}
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

			{/* Published Articles */}
			<div className="space-y-4">
				<h2 className="text-2xl font-bold text-gray-900">已发布的文章</h2>

				{publishedArticles.length === 0 ? (
					<p className="text-gray-500">暂无已发布文章</p>
				) : (
					<div className="space-y-3">
						{publishedArticles.map((article) => (
							<div
								key={article.id}
								className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
							>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									{article.title}
								</h3>

								{article.excerpt && (
									<p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>
								)}

								<div className="flex items-center gap-4 text-sm text-gray-500">
									{article.category && (
										<span className="bg-gray-100 px-2 py-1 rounded">
											{article.category.name}
										</span>
									)}
									<span>阅读 {article.viewCount}</span>
									<time className="ml-auto">
										{article.createdAt.toLocaleDateString("zh-CN")}
									</time>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Draft Articles */}
			{draftArticles.length > 0 && (
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
										<h3 className="text-lg font-semibold text-gray-900">
											{article.title}
										</h3>
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
			)}
		</div>
	);
}
