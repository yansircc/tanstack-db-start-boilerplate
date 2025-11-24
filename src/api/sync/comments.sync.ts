import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { comments } from "../../db/schema";
import type { InsertComment } from "../../db/schemas-zod";

export const getComments = createServerFn({ method: "GET" }).handler(
	async () => {
		const items = await db
			.select()
			.from(comments)
			.orderBy(desc(comments.createdAt))
			.limit(200);

		return items;
	},
);

export const createComment = createServerFn({ method: "POST" })
	.inputValidator((data: InsertComment) => data)
	.handler(async ({ data }) => {
		const [newComment] = await db
			.insert(comments)
			.values({
				content: data.content,
				articleId: data.articleId,
				authorId: data.authorId,
				parentId: data.parentId,
			})
			.returning();

		return newComment;
	});

export const updateComment = createServerFn({ method: "POST" })
	.inputValidator(
		(data: { id: number; changes: Partial<InsertComment> }) => data,
	)
	.handler(async ({ data }) => {
		const [updatedComment] = await db
			.update(comments)
			.set({
				...data.changes,
				updatedAt: new Date(),
			})
			.where(eq(comments.id, data.id))
			.returning();

		return updatedComment;
	});

export const deleteComment = createServerFn({ method: "POST" })
	.inputValidator((data: { id: number }) => data)
	.handler(async ({ data }) => {
		await db.delete(comments).where(eq(comments.id, data.id));

		return { success: true, id: data.id };
	});
