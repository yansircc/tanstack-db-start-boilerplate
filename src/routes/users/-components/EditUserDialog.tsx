import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { UserForm } from "./UserForm";
import { usersCollection } from "@/db/collections/users.collection";
import type { InsertUser, SelectUser } from "@/db/schemas-zod";

interface EditUserDialogProps {
	user: SelectUser;
	trigger: React.ReactNode;
}

export function EditUserDialog({ user, trigger }: EditUserDialogProps) {
	const [open, setOpen] = useState(false);

	const handleSubmit = (values: Partial<InsertUser>) => {
		// Update with optimistic updates - UI updates immediately!
		usersCollection.update(user.id, (draft) => {
			if (values.email) draft.email = values.email;
			if (values.displayName) draft.displayName = values.displayName;
			if (values.bio !== undefined) draft.bio = values.bio;
			if (values.avatar !== undefined) draft.avatar = values.avatar;
		});

		// Close dialog immediately - optimistic update is already shown
		// If mutation fails, TanStack DB will automatically rollback
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>编辑用户</DialogTitle>
					<DialogDescription>
						修改用户信息。用户名不可修改。
					</DialogDescription>
				</DialogHeader>
				<UserForm
					user={user}
					onSubmit={handleSubmit}
					onCancel={() => setOpen(false)}
					submitLabel="保存"
				/>
			</DialogContent>
		</Dialog>
	);
}
