import { ConfirmDialog } from "@/components/shared";
import { usersCollection } from "@/db/collections/users.collection";
import { useErrorHandler } from "@/lib/error-handler";
import type { SelectUser } from "@/db/schemas-zod";

interface DeleteUserDialogProps {
	user: SelectUser;
	trigger: React.ReactNode;
}

export function DeleteUserDialog({ user, trigger }: DeleteUserDialogProps) {
	const { handleError } = useErrorHandler();

	const handleDelete = async () => {
		try {
			const tx = usersCollection.delete(user.id);
			await tx.isPersisted.promise;
		} catch (error) {
			if (error instanceof Error && error.message.includes("FOREIGN KEY")) {
				handleError(
					new Error("该用户有关联数据(如文章、评论等),请先处理这些数据后再删除用户"),
					"删除用户失败",
				);
			} else {
				handleError(error, "删除用户失败");
			}
		}
	};

	return (
		<ConfirmDialog
			trigger={trigger}
			title="删除用户"
			description={
				<>
					确定要删除用户 <strong>{user.displayName}</strong> (@{user.username})
					吗？此操作无法撤销。
				</>
			}
			confirmLabel="确认删除"
			cancelLabel="取消"
			variant="destructive"
			onConfirm={handleDelete}
		/>
	);
}
