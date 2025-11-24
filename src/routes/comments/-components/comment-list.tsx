import { useState } from "react";
import { Pagination } from "@/components/pagination";
import {
	useCommentsQuery,
	useCommentsTotalQuery,
} from "../-hooks/use-comments-query";
import { CommentCard } from "./comment-card";

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
		return (
			<div className="rounded-sm border-2 border-foreground border-dashed p-12 text-center">
				<p className="font-mono text-lg text-muted-foreground uppercase">
					No comments found.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				{comments.map((comment) => (
					<CommentCard comment={comment} key={`comment-${comment.id}`} />
				))}
			</div>

			<Pagination
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				onPageChange={setCurrentPage}
				totalItems={totalCount}
			/>
		</div>
	);
}
