import {
	CollectionInErrorStateError,
	DeleteKeyNotFoundError,
	DuplicateKeyError,
	SchemaValidationError,
	UpdateKeyNotFoundError,
} from "@tanstack/db";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";

export type ErrorToast = {
	id: string;
	title: string;
	message: string;
	type: "error" | "warning" | "info";
	timestamp: Date;
};

export type ErrorHandlerContextValue = {
	errors: ErrorToast[];
	addError: (error: ErrorToast) => void;
	removeError: (id: string) => void;
	clearErrors: () => void;
	handleError: (error: unknown, context?: string) => void;
};

const ErrorHandlerContext = createContext<ErrorHandlerContextValue | null>(
	null
);

export function useErrorHandler() {
	const context = useContext(ErrorHandlerContext);
	if (!context) {
		throw new Error("useErrorHandler must be used within ErrorHandlerProvider");
	}
	return context;
}

function getErrorInfo(error: unknown): {
	title: string;
	message: string;
	type: "error" | "warning" | "info";
} {
	// Database-specific errors
	if (error instanceof SchemaValidationError) {
		return {
			title: "数据验证失败",
			message: error.issues[0]?.message || "提交的数据不符合要求,请检查后重试",
			type: "warning",
		};
	}

	if (error instanceof DuplicateKeyError) {
		return {
			title: "数据已存在",
			message: "该记录已存在,请勿重复添加",
			type: "warning",
		};
	}

	if (error instanceof UpdateKeyNotFoundError) {
		return {
			title: "记录不存在",
			message: "要更新的记录不存在,可能已被删除",
			type: "warning",
		};
	}

	if (error instanceof DeleteKeyNotFoundError) {
		return {
			title: "记录不存在",
			message: "要删除的记录不存在,可能已被删除",
			type: "warning",
		};
	}

	if (error instanceof CollectionInErrorStateError) {
		return {
			title: "数据同步错误",
			message: "数据同步出现问题,请刷新页面重试",
			type: "error",
		};
	}

	// Generic Error handling
	if (error instanceof Error) {
		if (error.message.includes("HTTP")) {
			return {
				title: "网络请求失败",
				message: "无法连接到服务器,请检查网络连接",
				type: "error",
			};
		}

		if (error.message.includes("Failed to fetch")) {
			return {
				title: "网络错误",
				message: "网络连接失败,请稍后重试",
				type: "error",
			};
		}

		if (error.message.includes("FOREIGN KEY")) {
			return {
				title: "数据关联错误",
				message: "该数据存在关联关系,无法删除",
				type: "warning",
			};
		}

		return {
			title: "操作失败",
			message: error.message,
			type: "error",
		};
	}

	// Unknown error
	return {
		title: "操作失败",
		message: "发生了未知错误",
		type: "error",
	};
}

type ErrorHandlerProviderProps = {
	children: ReactNode;
	maxErrors?: number;
};

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
		[maxErrors, removeError]
	);

	const clearErrors = useCallback(() => {
		setErrors([]);
	}, []);

	const handleError = useCallback(
		(error: unknown, context?: string) => {
			console.error("[ErrorHandler]", context, error);

			const errorInfo = getErrorInfo(error);
			const message = context
				? `${context}: ${errorInfo.message}`
				: errorInfo.message;

			addError({
				id: crypto.randomUUID(),
				title: errorInfo.title,
				message,
				type: errorInfo.type,
				timestamp: new Date(),
			});
		},
		[addError]
	);

	return (
		<ErrorHandlerContext.Provider
			value={{ errors, addError, removeError, clearErrors, handleError }}
		>
			{children}
		</ErrorHandlerContext.Provider>
	);
}
