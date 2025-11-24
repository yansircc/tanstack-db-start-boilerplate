import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: integer("id", { mode: "number" }).primaryKey({
		autoIncrement: true,
	}),
	username: text("username").notNull().unique(),
	email: text("email").notNull().unique(),
	displayName: text("display_name").notNull(),
	avatar: text("avatar"),
	bio: text("bio"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
});

export const categories = sqliteTable("categories", {
	id: integer("id", { mode: "number" }).primaryKey({
		autoIncrement: true,
	}),
	name: text("name").notNull().unique(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
});

export const articles = sqliteTable("articles", {
	id: integer("id", { mode: "number" }).primaryKey({
		autoIncrement: true,
	}),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	content: text("content").notNull(),
	excerpt: text("excerpt"),
	coverImage: text("cover_image"),
	status: text("status", { enum: ["draft", "published", "archived"] })
		.notNull()
		.default("draft"),
	viewCount: integer("view_count").notNull().default(0),
	authorId: integer("author_id")
		.notNull()
		.references(() => users.id),
	categoryId: integer("category_id")
		.notNull()
		.references(() => categories.id),
	publishedAt: integer("published_at", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
	deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const tags = sqliteTable("tags", {
	id: integer("id", { mode: "number" }).primaryKey({
		autoIncrement: true,
	}),
	name: text("name").notNull().unique(),
	slug: text("slug").notNull().unique(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
});

export const articleTags = sqliteTable("article_tags", {
	id: integer("id", { mode: "number" }).primaryKey({
		autoIncrement: true,
	}),
	articleId: integer("article_id")
		.notNull()
		.references(() => articles.id, { onDelete: "cascade" }),
	tagId: integer("tag_id")
		.notNull()
		.references(() => tags.id, { onDelete: "cascade" }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
});

export const comments = sqliteTable("comments", {
	id: integer("id", { mode: "number" }).primaryKey({
		autoIncrement: true,
	}),
	content: text("content").notNull(),
	articleId: integer("article_id")
		.notNull()
		.references(() => articles.id, { onDelete: "cascade" }),
	authorId: integer("author_id")
		.notNull()
		.references(() => users.id),
	parentId: integer("parent_id").references((): any => comments.id),
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
	deletedAt: integer("deleted_at", { mode: "timestamp" }),
});

export const articleLikes = sqliteTable("article_likes", {
	id: integer("id", { mode: "number" }).primaryKey({
		autoIncrement: true,
	}),
	articleId: integer("article_id")
		.notNull()
		.references(() => articles.id, { onDelete: "cascade" }),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
});

export const articleBookmarks = sqliteTable("article_bookmarks", {
	id: integer("id", { mode: "number" }).primaryKey({
		autoIncrement: true,
	}),
	articleId: integer("article_id")
		.notNull()
		.references(() => articles.id, { onDelete: "cascade" }),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	articles: many(articles),
	comments: many(comments),
	likes: many(articleLikes),
	bookmarks: many(articleBookmarks),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
	articles: many(articles),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
	author: one(users, {
		fields: [articles.authorId],
		references: [users.id],
	}),
	category: one(categories, {
		fields: [articles.categoryId],
		references: [categories.id],
	}),
	articleTags: many(articleTags),
	comments: many(comments),
	likes: many(articleLikes),
	bookmarks: many(articleBookmarks),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
	articleTags: many(articleTags),
}));

export const articleTagsRelations = relations(articleTags, ({ one }) => ({
	article: one(articles, {
		fields: [articleTags.articleId],
		references: [articles.id],
	}),
	tag: one(tags, {
		fields: [articleTags.tagId],
		references: [tags.id],
	}),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
	article: one(articles, {
		fields: [comments.articleId],
		references: [articles.id],
	}),
	author: one(users, {
		fields: [comments.authorId],
		references: [users.id],
	}),
	parent: one(comments, {
		fields: [comments.parentId],
		references: [comments.id],
	}),
	replies: many(comments),
}));

export const articleLikesRelations = relations(articleLikes, ({ one }) => ({
	article: one(articles, {
		fields: [articleLikes.articleId],
		references: [articles.id],
	}),
	user: one(users, {
		fields: [articleLikes.userId],
		references: [users.id],
	}),
}));

export const articleBookmarksRelations = relations(
	articleBookmarks,
	({ one }) => ({
		article: one(articles, {
			fields: [articleBookmarks.articleId],
			references: [articles.id],
		}),
		user: one(users, {
			fields: [articleBookmarks.userId],
			references: [users.id],
		}),
	}),
);
