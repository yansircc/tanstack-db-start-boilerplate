import { useLiveQuery } from "@tanstack/react-db";
import { useEffect, useRef, useState } from "react";
import { currentUserCollection, usersCollection } from "@/db/collections";

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
			}))
	);

	// 获取当前用户状态
	const { data: currentUserData } = useLiveQuery((q) =>
		q.from({ current: currentUserCollection }).select(({ current }) => ({
			id: current.id,
			userId: current.userId,
			username: current.username,
			displayName: current.displayName,
			avatar: current.avatar,
		}))
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
		if (!currentUser) {
			return;
		}

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
				className="flex items-center gap-2 rounded-sm border-2 border-transparent px-3 py-2 text-sm transition-all hover:border-foreground hover:bg-muted active:translate-y-0.5"
				onClick={() => setIsOpen(!isOpen)}
				type="button"
			>
				{currentUser?.avatar ? (
					<img
						alt={displayName}
						className="h-6 w-6 rounded-sm border border-foreground object-cover"
						height={24}
						src={currentUser.avatar}
						width={24}
					/>
				) : (
					<div className="flex h-6 w-6 items-center justify-center rounded-sm border border-foreground bg-secondary font-bold font-mono text-xs">
						{displayName.charAt(0).toUpperCase()}
					</div>
				)}
				<span className="font-bold font-mono text-xs uppercase">
					Role: {displayName}
				</span>
				<svg
					aria-hidden="true"
					className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						d="M19 9l-7 7-7-7"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
					/>
				</svg>
			</button>

			{isOpen && (
				<div className="absolute right-0 z-50 mt-2 max-h-96 w-72 overflow-y-auto rounded-sm border-2 border-foreground bg-white py-0 shadow-[4px_4px_0px_0px_var(--foreground)]">
					<div className="border-foreground border-b-2 bg-muted/50 px-4 py-3 font-bold font-mono text-xs uppercase">
						Switch Role
					</div>

					{/* 未登录选项 */}
					<button
						className={`flex w-full items-center gap-3 border-foreground/10 border-b px-4 py-3 text-left transition-colors hover:bg-muted ${
							currentUser?.userId ? "" : "bg-secondary/30"
						}`}
						onClick={() => switchUser(null)}
						type="button"
					>
						<div className="flex h-8 w-8 items-center justify-center rounded-sm border border-foreground bg-muted text-foreground">
							<svg
								aria-hidden="true"
								className="h-5 w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
								/>
							</svg>
						</div>
						<div className="min-w-0 flex-1">
							<div className="font-bold font-mono text-foreground text-sm">
								Guest Mode
							</div>
							<div className="text-muted-foreground text-xs">
								Read-only access
							</div>
						</div>
						{!currentUser?.userId && (
							<div className="h-2 w-2 rounded-full border border-foreground bg-green-500" />
						)}
					</button>

					{/* 用户列表 */}
					{users?.map((user) => (
						<button
							className={`flex w-full items-center gap-3 border-foreground/10 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted ${
								currentUser?.userId === user.id ? "bg-secondary/30" : ""
							}`}
							key={user.id}
							onClick={() => switchUser(user.id)}
							type="button"
						>
							{user.avatar ? (
								<img
									alt={user.displayName}
									className="h-8 w-8 rounded-sm border border-foreground object-cover"
									height={32}
									src={user.avatar}
									width={32}
								/>
							) : (
								<div className="flex h-8 w-8 items-center justify-center rounded-sm border border-foreground bg-accent font-bold font-mono text-sm">
									{user.displayName.charAt(0).toUpperCase()}
								</div>
							)}
							<div className="min-w-0 flex-1">
								<div className="truncate font-bold text-foreground text-sm">
									{user.displayName}
								</div>
								<div className="truncate font-mono text-muted-foreground text-xs">
									@{user.username}
								</div>
							</div>
							{currentUser?.userId === user.id && (
								<div className="h-2 w-2 rounded-full border border-foreground bg-green-500" />
							)}
						</button>
					))}

					{(!users || users.length === 0) && (
						<div className="px-4 py-4 text-center font-mono text-muted-foreground text-sm">
							NO USERS FOUND
						</div>
					)}
				</div>
			)}
		</div>
	);
}
