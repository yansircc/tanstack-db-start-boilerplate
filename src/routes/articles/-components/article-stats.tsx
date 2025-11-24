import { eq, useLiveQuery } from "@tanstack/react-db";
import { Bookmark, Heart } from "lucide-react";
import {
	articleBookmarksCollection,
	articleLikesCollection,
} from "@/db/collections";

type ArticleStatsProps = {
	articleId: number;
};

export function ArticleStats({ articleId }: ArticleStatsProps) {
	// 查询点赞数
	const { data: likes } = useLiveQuery((q) =>
		q
			.from({ like: articleLikesCollection })
			.where(({ like }) => eq(like.articleId, articleId))
			.select(({ like }) => ({ id: like.id }))
	);

	// 查询收藏数
	const { data: bookmarks } = useLiveQuery((q) =>
		q
			.from({ bookmark: articleBookmarksCollection })
			.where(({ bookmark }) => eq(bookmark.articleId, articleId))
			.select(({ bookmark }) => ({ id: bookmark.id }))
	);

	const likeCount = likes?.length ?? 0;
	const bookmarkCount = bookmarks?.length ?? 0;

	return (
		<div className="flex items-center gap-4">
			<span className="flex items-center gap-1 text-gray-500">
				<Heart className="h-4 w-4" />
				<span className="text-sm">{likeCount}</span>
			</span>
			<span className="flex items-center gap-1 text-gray-500">
				<Bookmark className="h-4 w-4" />
				<span className="text-sm">{bookmarkCount}</span>
			</span>
		</div>
	);
}
