import { useLiveQuery, eq } from "@tanstack/react-db";
import { Button } from "@/components/ui/button";
import {
	articleBookmarksCollection,
	currentUserCollection,
} from "@/db/collections";
import { useErrorHandler } from "@/lib/error-handler";
import { Bookmark } from "lucide-react";

interface ArticleBookmarkButtonProps {
	articleId: number;
}

export function ArticleBookmarkButton({
	articleId,
}: ArticleBookmarkButtonProps) {
	const { handleError } = useErrorHandler();

	// 获取当前用户
	const { data: currentUserData } = useLiveQuery((q) =>
		q.from({ current: currentUserCollection }).select(({ current }) => ({
			id: current.id,
			userId: current.userId,
		})),
	);
	const currentUser = currentUserData?.[0];

	// 查询所有收藏
	const { data: allBookmarks } = useLiveQuery((q) =>
		q
			.from({ bookmark: articleBookmarksCollection })
			.where(({ bookmark }) => eq(bookmark.articleId, articleId))
			.select(({ bookmark }) => ({
				id: bookmark.id,
				userId: bookmark.userId,
				articleId: bookmark.articleId,
			})),
	);

	// 检查当前用户是否已收藏
	const isBookmarked = allBookmarks?.some(
		(bookmark) => bookmark.userId === currentUser?.userId,
	);
	const bookmarkCount = allBookmarks?.length ?? 0;

	const handleToggleBookmark = () => {
		if (!currentUser?.userId) {
			handleError(new Error("未登录"), "请先选择用户");
			return;
		}

		try {
			if (isBookmarked) {
				// 取消收藏 - 找到对应的 bookmark 并删除
				const bookmarkToDelete = allBookmarks?.find(
					(bookmark) => bookmark.userId === currentUser.userId,
				);
				if (bookmarkToDelete) {
					articleBookmarksCollection.delete(bookmarkToDelete.id);
				}
			} else {
				// 收藏
				const tempId = -Math.floor(Math.random() * 1000000);
				articleBookmarksCollection.insert({
					id: tempId,
					articleId,
					userId: currentUser.userId,
					createdAt: new Date(),
				});
			}
		} catch (error) {
			handleError(error, "操作失败");
		}
	};

	return (
		<Button
			variant={isBookmarked ? "default" : "outline"}
			size="sm"
			onClick={handleToggleBookmark}
			disabled={!currentUser?.userId}
			className="gap-2 rounded-sm border-2 border-foreground"
		>
			<Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
			<span className="font-mono font-bold">{bookmarkCount}</span>
		</Button>
	);
}
