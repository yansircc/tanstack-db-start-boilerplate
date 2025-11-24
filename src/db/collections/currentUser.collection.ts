import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/react-db";
import { queryClient } from "@/lib/query-client";
import { z } from "zod";

// 当前用户的简化 schema (只需要基本信息)
const currentUserSchema = z.object({
	id: z.number(),
	userId: z.number().nullable(), // 当前登录的用户 ID，null 表示未登录
	username: z.string().nullable(),
	displayName: z.string().nullable(),
	avatar: z.string().nullable(),
});

export type CurrentUser = z.infer<typeof currentUserSchema>;

// 初始状态 - 默认未登录
const initialCurrentUser: CurrentUser = {
	id: 1, // 固定 id，因为只有一条记录
	userId: null,
	username: null,
	displayName: null,
	avatar: null,
};

// 创建 CurrentUser Collection
// 这是一个纯客户端状态管理，不需要后端持久化
export const currentUserCollection = createCollection(
	queryCollectionOptions({
		schema: currentUserSchema,
		queryKey: ["currentUser"],
		queryFn: async () => {
			// 从 localStorage 读取持久化的当前用户
			const stored = localStorage.getItem("currentUser");
			if (stored) {
				try {
					const parsed = JSON.parse(stored);
					return [parsed];
				} catch {
					// 解析失败，返回初始状态
				}
			}
			return [initialCurrentUser];
		},
		queryClient,
		getKey: (item) => item.id,

		// 当前用户状态变化时，持久化到 localStorage
		onUpdate: async ({ transaction }) => {
			// 这是纯客户端状态，不需要服务器持久化
			// 只需要保存到 localStorage
			const mutation = transaction.mutations[0];
			if (mutation?.modified) {
				localStorage.setItem("currentUser", JSON.stringify(mutation.modified));
			}
		},

		// 不需要 onInsert 和 onDelete，因为只有一条记录
		onInsert: async () => {
			// No-op: 当前用户状态在初始化时就存在
		},
		onDelete: async () => {
			// No-op: 不允许删除当前用户状态
		},
	}),
);
