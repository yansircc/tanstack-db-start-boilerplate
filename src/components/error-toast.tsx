import { useEffect, useState } from "react";
import { useErrorHandler } from "@/lib/error-handler";

type ErrorType = "error" | "warning" | "info";

const getErrorStyles = (type: ErrorType) => {
	if (type === "error") {
		return {
			container: "border border-red-200 bg-red-50",
			title: "text-red-900",
			message: "text-red-700",
			icon: "text-red-600",
			hover: "hover:bg-red-200",
		};
	}
	if (type === "warning") {
		return {
			container: "border border-yellow-200 bg-yellow-50",
			title: "text-yellow-900",
			message: "text-yellow-700",
			icon: "text-yellow-600",
			hover: "hover:bg-yellow-200",
		};
	}
	return {
		container: "border border-blue-200 bg-blue-50",
		title: "text-blue-900",
		message: "text-blue-700",
		icon: "text-blue-600",
		hover: "hover:bg-blue-200",
	};
};

const ErrorIcon = () => (
	<svg
		aria-hidden="true"
		className="h-5 w-5 text-red-600"
		fill="currentColor"
		viewBox="0 0 20 20"
	>
		<path
			clipRule="evenodd"
			d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
			fillRule="evenodd"
		/>
	</svg>
);

const WarningIcon = () => (
	<svg
		aria-hidden="true"
		className="h-5 w-5 text-yellow-600"
		fill="currentColor"
		viewBox="0 0 20 20"
	>
		<path
			clipRule="evenodd"
			d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
			fillRule="evenodd"
		/>
	</svg>
);

const InfoIcon = () => (
	<svg
		aria-hidden="true"
		className="h-5 w-5 text-blue-600"
		fill="currentColor"
		viewBox="0 0 20 20"
	>
		<path
			clipRule="evenodd"
			d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
			fillRule="evenodd"
		/>
	</svg>
);

const CloseIcon = () => (
	<svg
		aria-hidden="true"
		className="h-4 w-4"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			d="M6 18L18 6M6 6l12 12"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
		/>
	</svg>
);

const getIcon = (type: ErrorType) => {
	if (type === "error") {
		return <ErrorIcon />;
	}
	if (type === "warning") {
		return <WarningIcon />;
	}
	return <InfoIcon />;
};

type ErrorItemProps = {
	error: {
		id: string;
		type: ErrorType;
		title: string;
		message: string;
	};
	onRemove: (id: string) => void;
};

const ErrorItem = ({ error, onRemove }: ErrorItemProps) => {
	const styles = getErrorStyles(error.type);

	return (
		<div
			className={`slide-in-from-top flex animate-in items-start gap-3 rounded-lg p-4 shadow-lg ${styles.container}`}
			key={error.id}
		>
			<div className="shrink-0 pt-0.5">{getIcon(error.type)}</div>

			<div className="min-w-0 flex-1">
				<div className={`font-semibold text-sm ${styles.title}`}>
					{error.title}
				</div>
				<div className={`mt-1 text-sm ${styles.message}`}>{error.message}</div>
			</div>

			<button
				className={`shrink-0 rounded p-1 transition hover:bg-opacity-20 ${styles.hover}`}
				onClick={() => onRemove(error.id)}
				type="button"
			>
				<div className={styles.icon}>
					<CloseIcon />
				</div>
			</button>
		</div>
	);
};

export function ErrorToast() {
	const { errors, removeError } = useErrorHandler();
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return null;
	}

	return (
		<div className="fixed top-4 right-4 z-50 max-w-md space-y-2">
			{errors.map((error) => (
				<ErrorItem error={error} key={error.id} onRemove={removeError} />
			))}
		</div>
	);
}
