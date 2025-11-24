import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usersCollection } from "@/db/collections/users.collection";
import type { SelectUser } from "@/db/schemas-zod";

interface DeleteUserDialogProps {
	user: SelectUser;
	trigger: React.ReactNode;
}

export function DeleteUserDialog({ user, trigger }: DeleteUserDialogProps) {
	const [open, setOpen] = useState(false);

	const handleDelete = () => {
		// Delete with optimistic updates - UI updates immediately!
		usersCollection.delete(user.id);

		// Close dialog immediately - optimistic update is already shown
		// If mutation fails, TanStack DB will automatically rollback
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>删除用户</DialogTitle>
					<DialogDescription>
						确定要删除用户 <strong>{user.displayName}</strong> (@
						{user.username}) 吗？此操作无法撤销。
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => setOpen(false)}
					>
						取消
					</Button>
					<Button type="button" variant="destructive" onClick={handleDelete}>
						确认删除
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
