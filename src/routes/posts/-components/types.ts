import type {
	SelectArticle,
	SelectCategory,
	SelectUser,
} from "@/db/schemas-zod";

// Article with joined relations for display
export type ArticleWithRelations = Pick<
	SelectArticle,
	"id" | "title" | "slug" | "excerpt" | "coverImage" | "viewCount" | "createdAt"
> & {
	author: Pick<SelectUser, "id" | "displayName" | "avatar"> | undefined;
	category: Pick<SelectCategory, "id" | "name"> | undefined;
};
