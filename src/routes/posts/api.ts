import { createServerFn } from "@tanstack/react-start";
import { db } from "../../db/index";
import { articles, users, categories } from "../../db/schema";
import { eq } from "drizzle-orm";

// Server function to get published articles
export const getPublishedArticles = createServerFn({ method: "GET" }).handler(
	async () => {
		// Query articles with joins
		const result = await db
			.select({
				id: articles.id,
				title: articles.title,
				slug: articles.slug,
				excerpt: articles.excerpt,
				coverImage: articles.coverImage,
				viewCount: articles.viewCount,
				createdAt: articles.createdAt,
				author: {
					id: users.id,
					username: users.username,
					displayName: users.displayName,
					avatar: users.avatar,
				},
				category: {
					id: categories.id,
					name: categories.name,
					slug: categories.slug,
				},
			})
			.from(articles)
			.leftJoin(users, eq(articles.authorId, users.id))
			.leftJoin(categories, eq(articles.categoryId, categories.id))
			.where(eq(articles.status, "published"))
			.orderBy(articles.createdAt)
			.all();

		return result;
	},
);
