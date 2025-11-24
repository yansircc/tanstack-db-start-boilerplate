import type { SelectCategory } from "@/db/schemas-zod";

export type CategoryWithCount = Pick<
	SelectCategory,
	"id" | "name" | "slug" | "description"
> & {
	articleCount: number;
};
