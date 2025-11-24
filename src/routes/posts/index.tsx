import { eq, useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import {
	articlesCollection,
	categoriesCollection,
	usersCollection,
} from "../../db/collections";

export const Route = createFileRoute("/posts/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	// 直接在组件中定义查询
	const { data: articles } = useLiveQuery((q) =>
		q
			.from({ article: articlesCollection })
			.join(
				{ user: usersCollection },
				({ article, user }) => eq(article.authorId, user.id),
				"left",
			)
			.join(
				{ category: categoriesCollection },
				({ article, category }) => eq(article.categoryId, category.id),
				"left",
			)
			.where(({ article }) => eq(article.status, "published"))
			.orderBy(({ article }) => article.createdAt, "desc")
			.select(({ article, user, category }) => ({
				id: article.id,
				title: article.title,
				slug: article.slug,
				excerpt: article.excerpt,
				coverImage: article.coverImage,
				viewCount: article.viewCount,
				createdAt: article.createdAt,
				author: user,
				category: category,
			})),
	);

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<h1 className="text-3xl font-bold">文章列表</h1>

			{!articles || articles.length === 0 ? (
				<p className="text-gray-500">暂无文章</p>
			) : (
				<div className="space-y-4">
					{articles.map((article) => (
						<article
							key={article.id}
							className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
						>
							<h2 className="text-xl font-semibold mb-2">{article.title}</h2>

							{article.excerpt && (
								<p className="text-gray-600 mb-3">{article.excerpt}</p>
							)}

							<div className="flex items-center gap-4 text-sm text-gray-500">
								{article.author && (
									<div className="flex items-center gap-2">
										{article.author.avatar && (
											<img
												src={article.author.avatar}
												alt={article.author.displayName}
												className="w-6 h-6 rounded-full"
											/>
										)}
										<span>{article.author.displayName}</span>
									</div>
								)}

								{article.category && (
									<span className="bg-gray-100 px-2 py-1 rounded">
										{article.category.name}
									</span>
								)}

								<span>阅读 {article.viewCount}</span>

								<time className="ml-auto">
									{new Date(article.createdAt).toLocaleDateString("zh-CN")}
								</time>
							</div>
						</article>
					))}
				</div>
			)}
		</div>
	);
}
