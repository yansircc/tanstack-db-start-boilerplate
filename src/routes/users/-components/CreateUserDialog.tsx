import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserForm } from "./UserForm";
import { usersCollection } from "@/db/collections/users.collection";
import type { InsertUser } from "@/db/schemas-zod";

interface CreateUserDialogProps {
	trigger?: React.ReactNode;
}

export function CreateUserDialog({ trigger }: CreateUserDialogProps) {
	const [open, setOpen] = useState(false);

	const handleSubmit = (values: Partial<InsertUser>) => {
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
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger || <Button>创建用户</Button>}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>创建新用户</DialogTitle>
					<DialogDescription>
						填写下面的表单来创建一个新用户。所有标记 * 的字段都是必填的。
					</DialogDescription>
				</DialogHeader>
				<UserForm
					onSubmit={handleSubmit}
					onCancel={() => setOpen(false)}
					submitLabel="创建"
				/>
			</DialogContent>
		</Dialog>
	);
}
