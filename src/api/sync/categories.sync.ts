import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { categories } from "../../db/schema";
import type { InsertCategory } from "../../db/schemas-zod";

export const getCategories = createServerFn({ method: "GET" }).handler(
	async () => {
		const items = await db.select().from(categories).limit(100);
		return items;
	},
);

export const createCategory = createServerFn({ method: "POST" })
	.inputValidator((data: InsertCategory) => data)
	.handler(async ({ data }) => {
		const [newCategory] = await db
			.insert(categories)
			.values({
				name: data.name,
				slug: data.slug,
				description: data.description,
			})
			.returning();

		return newCategory;
	});

export const updateCategory = createServerFn({ method: "POST" })
	.inputValidator(
		(data: { id: number; changes: Partial<InsertCategory> }) => data,
	)
	.handler(async ({ data }) => {
		const [updatedCategory] = await db
			.update(categories)
			.set(data.changes)
			.where(eq(categories.id, data.id))
			.returning();

		return updatedCategory;
	});

export const deleteCategory = createServerFn({ method: "POST" })
	.inputValidator((data: { id: number }) => data)
	.handler(async ({ data }) => {
		await db.delete(categories).where(eq(categories.id, data.id));

		return { success: true, id: data.id };
	});
