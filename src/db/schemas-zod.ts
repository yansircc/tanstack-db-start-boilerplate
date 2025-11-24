import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
	articleBookmarks,
	articleLikes,
	articles,
	articleTags,
	categories,
	comments,
	tags,
	users,
} from "./schema";

// Users schemas
export const insertUserSchema = createInsertSchema(users, {
	email: z.email(),
	username: z.string().min(3).max(50),
	displayName: z.string().min(1).max(100),
	bio: z.string().max(500).nullable().optional(),
	avatar: z.string().url().nullable().optional(),
});
export const selectUserSchema = createSelectSchema(users);
export const updateUserSchema = insertUserSchema
	.partial()
	.omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectUser = z.infer<typeof selectUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

// Categories schemas
export const insertCategorySchema = createInsertSchema(categories, {
	name: z.string().min(1).max(50),
	slug: z
		.string()
		.min(1)
		.max(50)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	description: z.string().max(200).nullable().optional(),
});
export const selectCategorySchema = createSelectSchema(categories);
export const updateCategorySchema = insertCategorySchema
	.partial()
	.omit({ id: true, createdAt: true });

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type SelectCategory = z.infer<typeof selectCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;

// Articles schemas
export const insertArticleSchema = createInsertSchema(articles, {
	title: z.string().min(1).max(200),
	slug: z
		.string()
		.min(1)
		.max(200)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
	content: z.string().min(1),
	excerpt: z.string().max(500).nullable().optional(),
	coverImage: z.string().url().nullable().optional(),
	status: z.enum(["draft", "published", "archived"]),
	viewCount: z.number().int().nonnegative(),
	authorId: z.number().int().positive(),
	categoryId: z.number().int().positive(),
});
export const selectArticleSchema = createSelectSchema(articles);
export const updateArticleSchema = insertArticleSchema
	.partial()
	.omit({ id: true, createdAt: true });

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type SelectArticle = z.infer<typeof selectArticleSchema>;
export type UpdateArticle = z.infer<typeof updateArticleSchema>;

// Tags schemas
export const insertTagSchema = createInsertSchema(tags, {
	name: z.string().min(1).max(30),
	slug: z
		.string()
		.min(1)
		.max(30)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});
export const selectTagSchema = createSelectSchema(tags);
export const updateTagSchema = insertTagSchema
	.partial()
	.omit({ id: true, createdAt: true });

export type InsertTag = z.infer<typeof insertTagSchema>;
export type SelectTag = z.infer<typeof selectTagSchema>;
export type UpdateTag = z.infer<typeof updateTagSchema>;

// ArticleTags schemas
export const insertArticleTagSchema = createInsertSchema(articleTags, {
	articleId: z.number().int().positive(),
	tagId: z.number().int().positive(),
});
export const selectArticleTagSchema = createSelectSchema(articleTags);

export type InsertArticleTag = z.infer<typeof insertArticleTagSchema>;
export type SelectArticleTag = z.infer<typeof selectArticleTagSchema>;

// Comments schemas
export const insertCommentSchema = createInsertSchema(comments, {
	content: z.string().min(1).max(2000),
	articleId: z.number().int().positive(),
	authorId: z.number().int().positive(),
	parentId: z.number().int().positive().nullable().optional(),
});
export const selectCommentSchema = createSelectSchema(comments);
export const updateCommentSchema = insertCommentSchema.partial().omit({
	id: true,
	createdAt: true,
	articleId: true,
	authorId: true,
	parentId: true,
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type SelectComment = z.infer<typeof selectCommentSchema>;
export type UpdateComment = z.infer<typeof updateCommentSchema>;

// ArticleLikes schemas
export const insertArticleLikeSchema = createInsertSchema(articleLikes, {
	articleId: z.number().int().positive(),
	userId: z.number().int().positive(),
});
export const selectArticleLikeSchema = createSelectSchema(articleLikes);

export type InsertArticleLike = z.infer<typeof insertArticleLikeSchema>;
export type SelectArticleLike = z.infer<typeof selectArticleLikeSchema>;

// ArticleBookmarks schemas
export const insertArticleBookmarkSchema = createInsertSchema(
	articleBookmarks,
	{
		articleId: z.number().int().positive(),
		userId: z.number().int().positive(),
	},
);
export const selectArticleBookmarkSchema = createSelectSchema(articleBookmarks);

export type InsertArticleBookmark = z.infer<typeof insertArticleBookmarkSchema>;
export type SelectArticleBookmark = z.infer<typeof selectArticleBookmarkSchema>;

// Extended schemas with relations
export const selectArticleWithRelationsSchema = selectArticleSchema.extend({
	author: selectUserSchema.optional(),
	category: selectCategorySchema.optional(),
	tags: z.array(selectTagSchema).optional(),
	comments: z.array(selectCommentSchema).optional(),
	likeCount: z.number().int().nonnegative().optional(),
	bookmarkCount: z.number().int().nonnegative().optional(),
	isLiked: z.boolean().optional(),
	isBookmarked: z.boolean().optional(),
});

export type SelectArticleWithRelations = z.infer<
	typeof selectArticleWithRelationsSchema
>;

export const selectUserWithStatsSchema = selectUserSchema.extend({
	articleCount: z.number().int().nonnegative().optional(),
	commentCount: z.number().int().nonnegative().optional(),
});

export type SelectUserWithStats = z.infer<typeof selectUserWithStatsSchema>;
