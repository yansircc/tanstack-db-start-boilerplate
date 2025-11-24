import { useCommentsQuery } from "../-hooks/useCommentsQuery";
import { CommentCard } from "./CommentCard";

export function CommentList() {
	const { data: comments } = useCommentsQuery();

	if (!comments || comments.length === 0) {
		return <p className="text-gray-500">暂无评论</p>;
	}

	return (
		<div className="space-y-4">
			{comments.map((comment) => (
				<CommentCard key={comment.id} comment={comment} />
			))}
		</div>
	);
}
