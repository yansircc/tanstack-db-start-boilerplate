import { useLiveQuery } from "@tanstack/react-db";
import { categoriesCollection } from "@/db/collections";

/**
 * 获取简化的分类列表 (只包含 id 和 name)
 * 用于表单下拉选择
 */
export function useCategoriesSimpleQuery() {
	return useLiveQuery((q) =>
		q
			.from({ category: categoriesCollection })
			.select(({ category }) => ({
				id: category.id,
				name: category.name,
			}))
			.orderBy(({ category }) => category.name, "asc")
	);
}
