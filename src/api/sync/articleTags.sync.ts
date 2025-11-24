import { createServerFn } from "@tanstack/react-start";
import { db } from "../../db";
import { articleTags } from "../../db/schema";

export const getArticleTags = createServerFn({ method: "GET" }).handler(
	async () => {
		const items = db.select().from(articleTags).all();
		return items;
	},
);
