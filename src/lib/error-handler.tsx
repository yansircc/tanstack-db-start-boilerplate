import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useState,
} from "react";
import {
	CollectionInErrorStateError,
	DeleteKeyNotFoundError,
	DuplicateKeyError,
	SchemaValidationError,
	UpdateKeyNotFoundError,
} from "@tanstack/db";

export interface ErrorToast {
	id: string;
	title: string;
	message: string;
	type: "error" | "warning" | "info";
	timestamp: Date;
}

export interface ErrorHandlerContextValue {
	errors: ErrorToast[];
	addError: (error: ErrorToast) => void;
	removeError: (id: string) => void;
	clearErrors: () => void;
	handleError: (error: unknown, context?: string) => void;
}

const ErrorHandlerContext = createContext<ErrorHandlerContextValue | null>(
	null,
);

export function useErrorHandler() {
	const context = useContext(ErrorHandlerContext);
	if (!context) {
		throw new Error("useErrorHandler must be used within ErrorHandlerProvider");
	}
	return context;
}

interface ErrorHandlerProviderProps {
	children: ReactNode;
	maxErrors?: number;
}

export function ErrorHandlerProvider({
	children,
	maxErrors = 5,
}: ErrorHandlerProviderProps) {
	const [errors, setErrors] = useState<ErrorToast[]>([]);

	const removeError = useCallback((id: string) => {
		setErrors((prev) => prev.filter((error) => error.id !== id));
	}, []);

	const addError = useCallback(
		(error: ErrorToast) => {
			setErrors((prev) => {
				const newErrors = [error, ...prev];
				// 保持最大错误数量
				return newErrors.slice(0, maxErrors);
			});

			// 3 秒后自动移除错误
			setTimeout(() => {
				removeError(error.id);
			}, 3000);
		},
		[maxErrors, removeError],
	);

	const clearErrors = useCallback(() => {
		setErrors([]);
	}, []);

	const handleError = useCallback(
		(error: unknown, context?: string) => {
			console.error("[ErrorHandler]", context, error);

			let title = "操作失败";
			let message = "发生了未知错误";
			let type: "error" | "warning" | "info" = "error";

			// 根据错误类型提供友好的错误消息
			if (error instanceof SchemaValidationError) {
				title = "数据验证失败";
				message =
					error.issues[0]?.message || "提交的数据不符合要求,请检查后重试";
				type = "warning";
			} else if (error instanceof DuplicateKeyError) {
				title = "数据已存在";
				message = "该记录已存在,请勿重复添加";
				type = "warning";
			} else if (error instanceof UpdateKeyNotFoundError) {
				title = "记录不存在";
				message = "要更新的记录不存在,可能已被删除";
				type = "warning";
			} else if (error instanceof DeleteKeyNotFoundError) {
				title = "记录不存在";
				message = "要删除的记录不存在,可能已被删除";
				type = "warning";
			} else if (error instanceof CollectionInErrorStateError) {
				title = "数据同步错误";
				message = "数据同步出现问题,请刷新页面重试";
				type = "error";
			} else if (error instanceof Error) {
				// 处理网络错误
				if (error.message.includes("HTTP")) {
					title = "网络请求失败";
					message = "无法连接到服务器,请检查网络连接";
				} else if (error.message.includes("Failed to fetch")) {
					title = "网络错误";
					message = "网络连接失败,请稍后重试";
				} else if (error.message.includes("FOREIGN KEY")) {
					title = "数据关联错误";
					message = "该数据存在关联关系,无法删除";
					type = "warning";
				} else {
					message = error.message;
				}
			}

			// 添加上下文信息
			if (context) {
				message = `${context}: ${message}`;
			}

			addError({
				id: crypto.randomUUID(),
				title,
				message,
				type,
				timestamp: new Date(),
			});
		},
		[addError],
	);

	return (
		<ErrorHandlerContext.Provider
			value={{ errors, addError, removeError, clearErrors, handleError }}
		>
			{children}
		</ErrorHandlerContext.Provider>
	);
}
