import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { articleTags } from "@/db/schema";

export const getArticleTags = createServerFn({ method: "GET" }).handler(() =>
	db.select().from(articleTags).all()
);
