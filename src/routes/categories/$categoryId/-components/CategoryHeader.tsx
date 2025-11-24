import { useCategoryArticlesQuery } from "../../-hooks/useCategoryArticlesQuery";
import { useCategoryQuery } from "../../-hooks/useCategoryQuery";

interface CategoryHeaderProps {
	categoryId: number;
}

export function CategoryHeader({ categoryId }: CategoryHeaderProps) {
	const { data: category } = useCategoryQuery(categoryId);
	const { data: articles } = useCategoryArticlesQuery(categoryId);

	if (!category) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="text-center text-gray-500">分类不存在</div>
			</div>
		);
	}

	const totalArticles = articles?.length ?? 0;
	const totalViews =
		articles?.reduce((sum, article) => sum + (article?.viewCount ?? 0), 0) ?? 0;

	return (
		<div className="bg-linear-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 space-y-3">
			<div className="flex items-center gap-3">
				<div className="bg-blue-500 text-white px-4 py-2 rounded-full text-lg font-bold">
					{category.name[0].toUpperCase()}
				</div>
				<div className="flex-1">
					<h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
					<p className="text-gray-600 text-sm">#{category.slug}</p>
				</div>
			</div>

			{category.description && (
				<p className="text-gray-700 leading-relaxed">{category.description}</p>
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
	);
}
