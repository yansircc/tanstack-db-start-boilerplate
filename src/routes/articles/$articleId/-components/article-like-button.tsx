import { eq, useLiveQuery } from "@tanstack/react-db";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	articleLikesCollection,
	currentUserCollection,
} from "@/db/collections";
import { useErrorHandler } from "@/lib/error-handler";

type ArticleLikeButtonProps = {
	articleId: number;
};

export function ArticleLikeButton({ articleId }: ArticleLikeButtonProps) {
	const { handleError } = useErrorHandler();

	// 获取当前用户
	const { data: currentUserData } = useLiveQuery((q) =>
		q.from({ current: currentUserCollection }).select(({ current }) => ({
			id: current.id,
			userId: current.userId,
		}))
	);
	const currentUser = currentUserData?.[0];

	// 查询所有点赞
	const { data: allLikes } = useLiveQuery((q) =>
		q
			.from({ like: articleLikesCollection })
			.where(({ like }) => eq(like.articleId, articleId))
			.select(({ like }) => ({
				id: like.id,
				userId: like.userId,
				articleId: like.articleId,
			}))
	);

	// 检查当前用户是否已点赞
	const isLiked = allLikes?.some((like) => like.userId === currentUser?.userId);
	const likeCount = allLikes?.length ?? 0;

	const handleToggleLike = () => {
		if (!currentUser?.userId) {
			handleError(new Error("未登录"), "请先选择用户");
			return;
		}

		try {
			if (isLiked) {
				// 取消点赞 - 找到对应的 like 并删除
				const likeToDelete = allLikes?.find(
					(like) => like.userId === currentUser.userId
				);
				if (likeToDelete) {
					articleLikesCollection.delete(likeToDelete.id);
				}
			} else {
				// 点赞
				const tempId = -Math.floor(Math.random() * 1_000_000);
				articleLikesCollection.insert({
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
			className="gap-2 rounded-sm border-2 border-foreground"
			disabled={!currentUser?.userId}
			onClick={handleToggleLike}
			size="sm"
			variant={isLiked ? "default" : "outline"}
		>
			<Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
			<span className="font-bold font-mono">{likeCount}</span>
		</Button>
	);
}
