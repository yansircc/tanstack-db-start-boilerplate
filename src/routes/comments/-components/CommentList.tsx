import { useState } from "react";
import { Pagination } from "@/components/Pagination";
import {
	useCommentsQuery,
	useCommentsTotalQuery,
} from "../-hooks/useCommentsQuery";
import { CommentCard } from "./CommentCard";

export function CommentList() {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 20;

	const { data: comments } = useCommentsQuery({
		page: currentPage,
		limit: itemsPerPage,
	});
	const { data: totalComments } = useCommentsTotalQuery();

	const totalCount = totalComments?.length ?? 0;

	if (!comments || comments.length === 0) {
		return <p className="text-gray-500">暂无评论</p>;
	}

	return (
		<div className="space-y-4">
			<div className="space-y-4">
				{comments.map((comment) => (
					<CommentCard key={`comment-${comment.id}`} comment={comment} />
				))}
			</div>

			<Pagination
				currentPage={currentPage}
				totalItems={totalCount}
				itemsPerPage={itemsPerPage}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}
