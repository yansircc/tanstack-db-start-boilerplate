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
	const displayName = currentUser?.displayName || "Guest";

	return (
		<div className="relative z-50" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm border-2 border-transparent hover:border-foreground hover:bg-muted transition-all active:translate-y-0.5"
			>
				{currentUser?.avatar ? (
					<img
						src={currentUser.avatar}
						alt={displayName}
						className="w-6 h-6 rounded-sm border border-foreground object-cover"
					/>
				) : (
					<div className="w-6 h-6 rounded-sm bg-secondary border border-foreground flex items-center justify-center text-xs font-bold font-mono">
						{displayName.charAt(0).toUpperCase()}
					</div>
				)}
				<span className="font-mono font-bold uppercase text-xs">Role: {displayName}</span>
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
				<div className="absolute right-0 mt-2 w-72 bg-white rounded-sm border-2 border-foreground shadow-[4px_4px_0px_0px_var(--foreground)] py-0 z-50 max-h-96 overflow-y-auto">
					<div className="px-4 py-3 text-xs font-mono font-bold uppercase border-b-2 border-foreground bg-muted/50">
						Switch Role
					</div>

					{/* 未登录选项 */}
					<button
						type="button"
						onClick={() => switchUser(null)}
						className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left border-b border-foreground/10 ${
							!currentUser?.userId ? "bg-secondary/30" : ""
						}`}
					>
						<div className="w-8 h-8 rounded-sm bg-muted border border-foreground flex items-center justify-center text-foreground">
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
							<div className="font-bold text-sm text-foreground font-mono">Guest Mode</div>
							<div className="text-xs text-muted-foreground">Read-only access</div>
						</div>
						{!currentUser?.userId && (
							<div className="w-2 h-2 rounded-full bg-green-500 border border-foreground"></div>
						)}
					</button>

					{/* 用户列表 */}
					{users?.map((user) => (
						<button
							key={user.id}
							type="button"
							onClick={() => switchUser(user.id)}
							className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left border-b border-foreground/10 last:border-b-0 ${
								currentUser?.userId === user.id ? "bg-secondary/30" : ""
							}`}
						>
							{user.avatar ? (
								<img
									src={user.avatar}
									alt={user.displayName}
									className="w-8 h-8 rounded-sm border border-foreground object-cover"
								/>
							) : (
								<div className="w-8 h-8 rounded-sm bg-accent border border-foreground flex items-center justify-center text-sm font-bold font-mono">
									{user.displayName.charAt(0).toUpperCase()}
								</div>
							)}
							<div className="flex-1 min-w-0">
								<div className="font-bold text-sm text-foreground truncate">
									{user.displayName}
								</div>
								<div className="text-xs text-muted-foreground truncate font-mono">
									@{user.username}
								</div>
							</div>
							{currentUser?.userId === user.id && (
								<div className="w-2 h-2 rounded-full bg-green-500 border border-foreground"></div>
							)}
						</button>
					))}

					{(!users || users.length === 0) && (
						<div className="px-4 py-4 text-sm text-muted-foreground text-center font-mono">
							NO USERS FOUND
						</div>
					)}
				</div>
			)}
		</div>
	);
}
