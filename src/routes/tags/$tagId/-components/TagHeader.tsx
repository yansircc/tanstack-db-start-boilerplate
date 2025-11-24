import { useTagArticlesQuery } from "../../-hooks/useTagArticlesQuery";
import { useTagQuery } from "../../-hooks/useTagQuery";

interface TagHeaderProps {
	tagId: number;
}

export function TagHeader({ tagId }: TagHeaderProps) {
	const { data: tag } = useTagQuery(tagId);
	const { data: articles } = useTagArticlesQuery(tagId);

	if (!tag) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="text-center text-gray-500">标签不存在</div>
			</div>
		);
	}

	const totalArticles = articles?.length ?? 0;
	const totalViews =
		articles?.reduce((sum, article) => sum + (article?.viewCount ?? 0), 0) ?? 0;

	return (
		<div className="bg-linear-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6 space-y-3">
			<div className="flex items-center gap-3">
				<div className="bg-indigo-500 text-white px-4 py-2 rounded-full text-lg font-bold">
					#
				</div>
				<div className="flex-1">
					<h1 className="text-3xl font-bold text-gray-900">#{tag.name}</h1>
					<p className="text-gray-600 text-sm">{tag.slug}</p>
				</div>
			</div>

			<div className="flex items-center gap-6 text-sm border-t border-indigo-200 pt-3 mt-3">
				<div>
					<span className="font-semibold text-gray-900">{totalArticles}</span>{" "}
					篇文章
				</div>
				<div>
					<span className="font-semibold text-gray-900">{totalViews}</span>{" "}
					总阅读量
				</div>
			</div>
		</div>
	);
}
