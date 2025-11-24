import type { SelectTag } from "@/db/schemas-zod";

export type TagDisplay = Pick<SelectTag, "id" | "name" | "slug">;
