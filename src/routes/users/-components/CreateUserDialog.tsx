import { MutationDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { usersCollection } from "@/db/collections/users.collection";
import type { InsertUser } from "@/db/schemas-zod";
import { UserForm } from "./UserForm";

interface CreateUserDialogProps {
	trigger?: React.ReactNode;
}

export function CreateUserDialog({ trigger }: CreateUserDialogProps) {
	const handleSubmit = (values: Partial<InsertUser>, onClose: () => void) => {
		// Validation: ensure required fields exist
		if (!values.username || !values.email || !values.displayName) {
			return;
		}

		// Use a temporary ID (negative number)
		const tempId = -Math.floor(Math.random() * 1000000);

		// Insert with optimistic updates - UI updates immediately!
		usersCollection.insert({
			id: tempId,
			username: values.username,
			email: values.email,
			displayName: values.displayName,
			bio: values.bio ?? null,
			avatar: values.avatar ?? null,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		// Close dialog immediately - optimistic update is already shown
		// If mutation fails, TanStack DB will automatically rollback
		onClose();
	};

	return (
		<MutationDialog
			trigger={trigger || <Button>创建用户</Button>}
			title="创建新用户"
			description="填写下面的表单来创建一个新用户。所有标记 * 的字段都是必填的。"
		>
			{({ onClose }) => (
				<UserForm
					onSubmit={(values) => handleSubmit(values, onClose)}
					onCancel={onClose}
					submitLabel="创建"
				/>
			)}
		</MutationDialog>
	);
}
