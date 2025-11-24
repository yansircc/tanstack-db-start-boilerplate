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
		return (
			<div className="border-2 border-foreground border-dashed rounded-sm p-12 text-center">
				<p className="text-muted-foreground font-mono text-lg uppercase">
					No comments found.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
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
