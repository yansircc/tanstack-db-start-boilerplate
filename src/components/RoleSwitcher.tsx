import { useLiveQuery } from "@tanstack/react-db";
import { usersCollection, currentUserCollection } from "@/db/collections";
import { useState, useRef, useEffect } from "react";

export function RoleSwitcher() {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// 获取所有用户
	const { data: users } = useLiveQuery((q) =>
		q
			.from({ user: usersCollection })
			.orderBy(({ user }) => user.username, "asc")
			.select(({ user }) => ({
				id: user.id,
				username: user.username,
				displayName: user.displayName,
				avatar: user.avatar,
			})),
	);

	// 获取当前用户状态
	const { data: currentUserData } = useLiveQuery((q) =>
		q.from({ current: currentUserCollection }).select(({ current }) => ({
			id: current.id,
			userId: current.userId,
			username: current.username,
			displayName: current.displayName,
			avatar: current.avatar,
		})),
	);

	const currentUser = currentUserData?.[0];

	// 点击外部关闭下拉菜单
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	// 切换用户
	const switchUser = (userId: number | null) => {
		if (!currentUser) return;

		const selectedUser = users?.find((u) => u.id === userId);

		// 使用 TanStack DB 的乐观更新
		currentUserCollection.update(currentUser.id, (draft) => {
			draft.userId = userId;
			draft.username = selectedUser?.username ?? null;
			draft.displayName = selectedUser?.displayName ?? null;
			draft.avatar = selectedUser?.avatar ?? null;
		});

		setIsOpen(false);
	};

	// 当前显示的名称
	const displayName = currentUser?.displayName || "未登录";

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 transition-colors"
			>
				{currentUser?.avatar ? (
					<img
						src={currentUser.avatar}
						alt={displayName}
						className="w-6 h-6 rounded-full object-cover"
					/>
				) : (
					<div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
						{displayName.charAt(0).toUpperCase()}
					</div>
				)}
				<span className="font-medium">当前: {displayName}</span>
				<svg aria-hidden="true"
					className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
					<div className="px-3 py-2 text-xs text-gray-500 font-semibold uppercase border-b border-gray-100">
						切换角色
					</div>

					{/* 未登录选项 */}
					<button
						type="button"
						onClick={() => switchUser(null)}
						className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left ${
							!currentUser?.userId ? "bg-blue-50" : ""
						}`}
					>
						<div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
							<svg aria-hidden="true"
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
						</div>
						<div className="flex-1 min-w-0">
							<div className="font-medium text-sm text-gray-900">未登录</div>
							<div className="text-xs text-gray-500">游客模式</div>
						</div>
						{!currentUser?.userId && (
							<svg aria-hidden="true"
								className="w-5 h-5 text-blue-600"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clipRule="evenodd"
								/>
							</svg>
						)}
					</button>

					<div className="border-t border-gray-100 my-1" />

					{/* 用户列表 */}
					{users?.map((user) => (
						<button
							key={user.id}
							type="button"
							onClick={() => switchUser(user.id)}
							className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left ${
								currentUser?.userId === user.id ? "bg-blue-50" : ""
							}`}
						>
							{user.avatar ? (
								<img
									src={user.avatar}
									alt={user.displayName}
									className="w-8 h-8 rounded-full object-cover"
								/>
							) : (
								<div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-600">
									{user.displayName.charAt(0).toUpperCase()}
								</div>
							)}
							<div className="flex-1 min-w-0">
								<div className="font-medium text-sm text-gray-900 truncate">
									{user.displayName}
								</div>
								<div className="text-xs text-gray-500 truncate">
									@{user.username}
								</div>
							</div>
							{currentUser?.userId === user.id && (
								<svg aria-hidden="true"
									className="w-5 h-5 text-blue-600 flex-shrink-0"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							)}
						</button>
					))}

					{(!users || users.length === 0) && (
						<div className="px-3 py-4 text-sm text-gray-500 text-center">
							暂无用户
						</div>
					)}
				</div>
			)}
		</div>
	);
}
