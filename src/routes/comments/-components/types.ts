import type {
	SelectArticle,
	SelectComment,
	SelectUser,
} from "@/db/schemas-zod";

export type CommentWithRelations = Pick<
	SelectComment,
	"id" | "content" | "createdAt"
> & {
	author: Pick<SelectUser, "displayName" | "avatar"> | undefined;
	article: Pick<SelectArticle, "title"> | undefined;
};
