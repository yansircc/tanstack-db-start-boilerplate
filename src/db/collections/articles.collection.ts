import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { db } from "../index";
import { articles } from "../schema";
import { queryClient } from "./query-client";

// Collection = 数据库表的客户端镜像
// 使用 queryCollectionOptions 来获得完整的功能（包括 writeBatch 等）
export const articlesCollection = createCollection(
	queryCollectionOptions({
		id: "articles",
		queryKey: ["articles"],
		queryClient,
		getKey: (item) => item.id,
		queryFn: async () => {
			// 从本地数据库查询所有文章
			const data = await db.select().from(articles);
			return data;
		},
	}),
);
