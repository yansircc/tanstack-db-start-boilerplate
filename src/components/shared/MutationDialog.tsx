import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface MutationDialogProps {
	trigger?: React.ReactNode;
	title: string;
	description?: string;
	children: (props: {
		onClose: () => void;
		isOpen: boolean;
	}) => React.ReactNode;
	defaultOpen?: boolean;
}

/**
 * 通用的 Mutation 对话框组件
 * 用于处理 Create/Edit 等需要表单的场景
 *
 * @example
 * ```tsx
 * <MutationDialog
 *   title="创建用户"
 *   description="填写表单创建新用户"
 *   trigger={<Button>创建</Button>}
 * >
 *   {({ onClose }) => (
 *     <UserForm onSubmit={(values) => {
 *       usersCollection.insert(values);
 *       onClose();
 *     }} />
 *   )}
 * </MutationDialog>
 * ```
 */
export function MutationDialog({
	trigger,
	title,
	description,
	children,
	defaultOpen = false,
}: MutationDialogProps) {
	const [open, setOpen] = useState(defaultOpen);

	const handleClose = () => setOpen(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				{children({ onClose: handleClose, isOpen: open })}
			</DialogContent>
		</Dialog>
	);
}
