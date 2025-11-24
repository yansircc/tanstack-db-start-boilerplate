import type { SelectUser } from "@/db/schemas-zod";

export type UserDisplay = Pick<
	SelectUser,
	| "id"
	| "username"
	| "displayName"
	| "email"
	| "avatar"
	| "bio"
	| "createdAt"
	| "updatedAt"
>;
