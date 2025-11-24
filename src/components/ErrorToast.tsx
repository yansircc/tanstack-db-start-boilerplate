import { useEffect, useState } from "react";
import { useErrorHandler } from "@/lib/error-handler";

export function ErrorToast() {
	const { errors, removeError } = useErrorHandler();
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) return null;

	return (
		<div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
			{errors.map((error) => (
				<div
					key={error.id}
					className={`rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-top ${
						error.type === "error"
							? "bg-red-50 border border-red-200"
							: error.type === "warning"
								? "bg-yellow-50 border border-yellow-200"
								: "bg-blue-50 border border-blue-200"
					}`}
				>
					{/* Icon */}
					<div className="shrink-0 pt-0.5">
						{error.type === "error" ? (
							<svg
								aria-hidden="true"
								className="w-5 h-5 text-red-600"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clipRule="evenodd"
								/>
							</svg>
						) : error.type === "warning" ? (
							<svg
								aria-hidden="true"
								className="w-5 h-5 text-yellow-600"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
									clipRule="evenodd"
								/>
							</svg>
						) : (
							<svg
								aria-hidden="true"
								className="w-5 h-5 text-blue-600"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clipRule="evenodd"
								/>
							</svg>
						)}
					</div>

					{/* Content */}
					<div className="flex-1 min-w-0">
						<div
							className={`text-sm font-semibold ${
								error.type === "error"
									? "text-red-900"
									: error.type === "warning"
										? "text-yellow-900"
										: "text-blue-900"
							}`}
						>
							{error.title}
						</div>
						<div
							className={`text-sm mt-1 ${
								error.type === "error"
									? "text-red-700"
									: error.type === "warning"
										? "text-yellow-700"
										: "text-blue-700"
							}`}
						>
							{error.message}
						</div>
					</div>

					{/* Close button */}
					<button
						type="button"
						onClick={() => removeError(error.id)}
						className={`shrink-0 rounded p-1 hover:bg-opacity-20 transition ${
							error.type === "error"
								? "hover:bg-red-200"
								: error.type === "warning"
									? "hover:bg-yellow-200"
									: "hover:bg-blue-200"
						}`}
					>
						<svg
							aria-hidden="true"
							className={`w-4 h-4 ${
								error.type === "error"
									? "text-red-600"
									: error.type === "warning"
										? "text-yellow-600"
										: "text-blue-600"
							}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			))}
		</div>
	);
}
