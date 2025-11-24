import { eq, useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import {
	articlesCollection,
	categoriesCollection,
	usersCollection,
} from "../../../db/collections";

export const Route = createFileRoute("/categories/$categoryId/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { categoryId } = Route.useParams();
	const categoryIdNum = Number(categoryId);

	// Get category info using findOne
	const { data: category } = useLiveQuery((q) =>
		q
			.from({ category: categoriesCollection })
			.where(({ category }) => eq(category.id, categoryIdNum))
			.select(({ category }) => ({
				id: category.id,
				name: category.name,
				slug: category.slug,
				description: category.description,
				createdAt: category.createdAt,
			}))
			.findOne(),
	);

	// Get articles in this category with authors
	const { data: articles } = useLiveQuery((q) =>
		q
			.from({ article: articlesCollection })
			.join(
				{ user: usersCollection },
				({ article, user }) => eq(article.authorId, user.id),
				"left",
			)
			.where(({ article }) => eq(article.categoryId, categoryIdNum))
			.where(({ article }) => eq(article.status, "published"))
			.orderBy(({ article }) => article.createdAt, "desc")
			.select(({ article, user }) => ({
				id: article.id,
				title: article.title,
				slug: article.slug,
				excerpt: article.excerpt,
				coverImage: article.coverImage,
				viewCount: article.viewCount,
				createdAt: article.createdAt,
				author: user,
			})),
	);

	if (!category) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="text-center text-gray-500">分类不存在</div>
			</div>
		);
	}

	// Calculate statistics on client side
	const totalArticles = articles?.length ?? 0;
	const totalViews =
		articles?.reduce((sum, article) => sum + article.viewCount, 0) ?? 0;

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			{/* Category Header */}
			<div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 space-y-3">
				<div className="flex items-center gap-3">
					<div className="bg-blue-500 text-white px-4 py-2 rounded-full text-lg font-bold">
						{category.name[0].toUpperCase()}
					</div>
					<div className="flex-1">
						<h1 className="text-3xl font-bold text-gray-900">
							{category.name}
						</h1>
						<p className="text-gray-600 text-sm">#{category.slug}</p>
					</div>
				</div>

				{category.description && (
					<p className="text-gray-700 leading-relaxed">
						{category.description}
					</p>
				)}

				<div className="flex items-center gap-6 text-sm border-t border-blue-200 pt-3 mt-3">
					<div>
						<span className="font-semibold text-gray-900">{totalArticles}</span>{" "}
						篇文章
					</div>
					<div>
						<span className="font-semibold text-gray-900">{totalViews}</span>{" "}
						总阅读量
					</div>
					<div className="ml-auto text-xs text-gray-600">
						创建于 {category.createdAt.toLocaleDateString("zh-CN")}
					</div>
				</div>
			</div>

			{/* Articles in Category */}
			<div className="space-y-4">
				<h2 className="text-2xl font-bold text-gray-900">
					{category.name} 下的文章
				</h2>

				{!articles || articles.length === 0 ? (
					<p className="text-gray-500">该分类下暂无文章</p>
				) : (
					<div className="space-y-4">
						{articles.map((article) => (
							<div
								key={article.id}
								className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition space-y-3"
							>
								<div className="flex items-start gap-4">
									{article.coverImage && (
										<img
											src={article.coverImage}
											alt={article.title}
											className="w-32 h-24 object-cover rounded"
										/>
									)}

									<div className="flex-1">
										<h3 className="text-xl font-semibold text-gray-900 mb-2">
											{article.title}
										</h3>

										{article.excerpt && (
											<p className="text-gray-600 text-sm mb-3">
												{article.excerpt}
											</p>
										)}

										<div className="flex items-center gap-4 text-sm text-gray-500">
											{article.author && (
												<div className="flex items-center gap-2">
													{article.author.avatar ? (
														<img
															src={article.author.avatar}
															alt={article.author.displayName}
															className="w-6 h-6 rounded-full"
														/>
													) : (
														<div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
															<span className="text-xs text-gray-500">
																{article.author.displayName[0].toUpperCase()}
															</span>
														</div>
													)}
													<span>{article.author.displayName}</span>
												</div>
											)}

											<span>阅读 {article.viewCount}</span>

											<time className="ml-auto">
												{article.createdAt.toLocaleDateString("zh-CN")}
											</time>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
