import { MutationDialog } from "@/components/shared";
import { usersCollection } from "@/db/collections/users.collection";
import type { InsertUser, SelectUser } from "@/db/schemas-zod";
import { UserForm } from "./UserForm";

interface EditUserDialogProps {
	user: SelectUser;
	trigger: React.ReactNode;
}

export function EditUserDialog({ user, trigger }: EditUserDialogProps) {
	const handleSubmit = (values: Partial<InsertUser>, onClose: () => void) => {
		// Update with optimistic updates - UI updates immediately!
		usersCollection.update(user.id, (draft) => {
			if (values.email) draft.email = values.email;
			if (values.displayName) draft.displayName = values.displayName;
			if (values.bio !== undefined) draft.bio = values.bio;
			if (values.avatar !== undefined) draft.avatar = values.avatar;
		});

		// Close dialog immediately - optimistic update is already shown
		// If mutation fails, TanStack DB will automatically rollback
		onClose();
	};

	return (
		<MutationDialog
			trigger={trigger}
			title="编辑用户"
			description="修改用户信息。用户名不可修改。"
		>
			{({ onClose }) => (
				<UserForm
					user={user}
					onSubmit={(values) => handleSubmit(values, onClose)}
					onCancel={onClose}
					submitLabel="保存"
				/>
			)}
		</MutationDialog>
	);
}
