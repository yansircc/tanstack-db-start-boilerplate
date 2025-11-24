import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { articleBookmarks } from "../../db/schema";
import type { InsertArticleBookmark } from "../../db/schemas-zod";

export const getArticleBookmarks = createServerFn({ method: "GET" }).handler(
	async () => {
		const items = await db.select().from(articleBookmarks).limit(500);
		return items;
	},
);

export const createArticleBookmark = createServerFn({ method: "POST" })
	.inputValidator((data: InsertArticleBookmark) => data)
	.handler(async ({ data }) => {
		// Check if bookmark already exists
		const existing = await db
			.select()
			.from(articleBookmarks)
			.where(
				and(
					eq(articleBookmarks.articleId, data.articleId),
					eq(articleBookmarks.userId, data.userId),
				),
			)
			.limit(1);

		if (existing.length > 0) {
			return existing[0];
		}

		// @ts-expect-error - Drizzle ORM type inference issue with returning()
		const [newBookmark] = await db
			.insert(articleBookmarks)
			.values({
				articleId: data.articleId,
				userId: data.userId,
				createdAt: new Date(),
			})
			.returning();

		return newBookmark;
	});

export const deleteArticleBookmark = createServerFn({ method: "POST" })
	.inputValidator((data: { articleId: number; userId: number }) => data)
	.handler(async ({ data }) => {
		await db
			.delete(articleBookmarks)
			.where(
				and(
					eq(articleBookmarks.articleId, data.articleId),
					eq(articleBookmarks.userId, data.userId),
				),
			);

		return { success: true };
	});
