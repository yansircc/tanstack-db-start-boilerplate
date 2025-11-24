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

interface ConfirmDialogProps {
	trigger: React.ReactNode;
	title: string;
	description: string | React.ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: "default" | "destructive";
	onConfirm: () => void | Promise<void>;
	onCancel?: () => void;
}

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
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={handleCancel}
						disabled={isLoading}
					>
						{cancelLabel}
					</Button>
					<Button
						type="button"
						variant={variant}
						onClick={handleConfirm}
						disabled={isLoading}
					>
						{isLoading ? "处理中..." : confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
