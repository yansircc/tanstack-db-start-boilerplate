import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

type ConfirmDialogProps = {
	trigger: React.ReactNode;
	title: string;
	description: string | React.ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: "default" | "destructive";
	onConfirm: () => void | Promise<void>;
	onCancel?: () => void;
};

/**
 * 通用的确认对话框组件
 * 用于处理 Delete 等需要二次确认的操作
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   trigger={<Button variant="destructive">删除</Button>}
 *   title="删除用户"
 *   description="确定要删除该用户吗？此操作无法撤销。"
 *   confirmLabel="确认删除"
 *   variant="destructive"
 *   onConfirm={() => usersCollection.delete(user.id)}
 * />
 * ```
 */
export function ConfirmDialog({
	trigger,
	title,
	description,
	confirmLabel = "确认",
	cancelLabel = "取消",
	variant = "default",
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleConfirm = async () => {
		setIsLoading(true);
		try {
			await onConfirm();
			setOpen(false);
		} catch (error) {
			console.error("Confirm action failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		setOpen(false);
		onCancel?.();
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						disabled={isLoading}
						onClick={handleCancel}
						type="button"
						variant="outline"
					>
						{cancelLabel}
					</Button>
					<Button
						disabled={isLoading}
						onClick={handleConfirm}
						type="button"
						variant={variant}
					>
						{isLoading ? "处理中..." : confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
