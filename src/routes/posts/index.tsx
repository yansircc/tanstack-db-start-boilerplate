import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPublishedArticles } from "./api";

export const Route = createFileRoute("/posts/")({
	component: RouteComponent,
	loader: ({ context }) =>
		context.queryClient.ensureQueryData({
			queryKey: ["articles", "published"],
			queryFn: () => getPublishedArticles(),
		}),
});

function RouteComponent() {
	const { data: articles } = useSuspenseQuery({
		queryKey: ["articles", "published"],
		queryFn: () => getPublishedArticles(),
	});

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
