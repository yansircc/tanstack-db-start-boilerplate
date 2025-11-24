import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { tags } from "../../db/schema";
import type { InsertTag } from "../../db/schemas-zod";

export const getTags = createServerFn({ method: "GET" }).handler(async () => {
	const items = db.select().from(tags).all();
	return items;
});

export const createTag = createServerFn({ method: "POST" })
	.inputValidator((data: InsertTag) => data)
	.handler(async ({ data }) => {
		const [newTag] = await db
			.insert(tags)
			.values({
				name: data.name,
				slug: data.slug,
			})
			.returning();

		return newTag;
	});

export const updateTag = createServerFn({ method: "POST" })
	.inputValidator((data: { id: number; changes: Partial<InsertTag> }) => data)
	.handler(async ({ data }) => {
		const [updatedTag] = await db
			.update(tags)
			.set(data.changes)
			.where(eq(tags.id, data.id))
			.returning();

		return updatedTag;
	});

export const deleteTag = createServerFn({ method: "POST" })
	.inputValidator((data: { id: number }) => data)
	.handler(async ({ data }) => {
		await db.delete(tags).where(eq(tags.id, data.id));

		return { success: true, id: data.id };
	});
