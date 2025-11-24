import { useLiveQuery } from "@tanstack/react-db";
import {
	articlesCollection,
	categoriesCollection,
	commentsCollection,
	tagsCollection,
	usersCollection,
} from "@/db/collections";

export function useStatsQuery() {
	// 单独查询每个表的统计数据
	const { data: articles } = useLiveQuery((q) =>
		q.from({ article: articlesCollection }).select(() => ({ count: 1 }))
	);

	const { data: users } = useLiveQuery((q) =>
		q.from({ user: usersCollection }).select(() => ({ count: 1 }))
	);

	const { data: categories } = useLiveQuery((q) =>
		q.from({ category: categoriesCollection }).select(() => ({ count: 1 }))
	);

	const { data: tags } = useLiveQuery((q) =>
		q.from({ tag: tagsCollection }).select(() => ({ count: 1 }))
	);

	const { data: comments } = useLiveQuery((q) =>
		q.from({ comment: commentsCollection }).select(() => ({ count: 1 }))
	);

	return {
		data: {
			totalArticles: articles?.length ?? 0,
			totalUsers: users?.length ?? 0,
			totalCategories: categories?.length ?? 0,
			totalTags: tags?.length ?? 0,
			totalComments: comments?.length ?? 0,
		},
	};
}
