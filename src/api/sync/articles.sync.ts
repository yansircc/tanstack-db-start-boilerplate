import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { articles } from "../../db/schema";
import type { InsertArticle } from "../../db/schemas-zod";

// Server function to fetch all articles
export const getArticles = createServerFn({ method: "GET" }).handler(
	async () => {
		const items = await db
			.select()
			.from(articles)
			.orderBy(desc(articles.createdAt))
			.limit(100);

		return items;
	},
);

export const createArticle = createServerFn({ method: "POST" })
	.inputValidator((data: InsertArticle) => data)
	.handler(async ({ data }) => {
		const [newArticle] = await db
			.insert(articles)
			.values({
				title: data.title,
				slug: data.slug,
				content: data.content,
				excerpt: data.excerpt,
				coverImage: data.coverImage,
				status: data.status,
				viewCount: data.viewCount || 0,
				authorId: data.authorId,
				categoryId: data.categoryId,
			})
			.returning();

		return newArticle;
	});

export const updateArticle = createServerFn({ method: "POST" })
	.inputValidator(
		(data: { id: number; changes: Partial<InsertArticle> }) => data,
	)
	.handler(async ({ data }) => {
		const [updatedArticle] = await db
			.update(articles)
			.set({
				...data.changes,
				updatedAt: new Date(),
			})
			.where(eq(articles.id, data.id))
			.returning();

		return updatedArticle;
	});

export const deleteArticle = createServerFn({ method: "POST" })
	.inputValidator((data: { id: number }) => data)
	.handler(async ({ data }) => {
		await db.delete(articles).where(eq(articles.id, data.id));

		return { success: true, id: data.id };
	});
