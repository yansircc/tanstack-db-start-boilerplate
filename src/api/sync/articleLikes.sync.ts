import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { articleLikes } from "../../db/schema";
import type { InsertArticleLike } from "../../db/schemas-zod";

export const getArticleLikes = createServerFn({ method: "GET" }).handler(
	async () => {
		const items = await db.select().from(articleLikes).limit(500);
		return items;
	},
);

export const createArticleLike = createServerFn({ method: "POST" })
	.inputValidator((data: InsertArticleLike) => data)
	.handler(async ({ data }) => {
		// Check if like already exists
		const existing = await db
			.select()
			.from(articleLikes)
			.where(
				and(
					eq(articleLikes.articleId, data.articleId),
					eq(articleLikes.userId, data.userId),
				),
			)
			.limit(1);

		if (existing.length > 0) {
			return existing[0];
		}

		// @ts-expect-error - Drizzle ORM type inference issue with returning()
		const [newLike] = await db
			.insert(articleLikes)
			.values({
				articleId: data.articleId,
				userId: data.userId,
				createdAt: new Date(),
			})
			.returning();

		return newLike;
	});

export const deleteArticleLike = createServerFn({ method: "POST" })
	.inputValidator((data: { articleId: number; userId: number }) => data)
	.handler(async ({ data }) => {
		await db
			.delete(articleLikes)
			.where(
				and(
					eq(articleLikes.articleId, data.articleId),
					eq(articleLikes.userId, data.userId),
				),
			);

		return { success: true };
	});
