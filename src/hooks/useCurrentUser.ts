import { useLiveQuery } from "@tanstack/react-db";
import { currentUserCollection } from "@/db/collections";

/**
 * 获取当前登录的用户信息
 *
 * 这是一个纯客户端状态,用于"伪登录"功能
 * 状态会自动持久化到 localStorage
 *
 * @returns 当前用户信息,如果未登录则 userId 为 null
 */
export function useCurrentUser() {
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

	return {
		currentUser,
		isLoggedIn: currentUser?.userId !== null,
		userId: currentUser?.userId ?? null,
		username: currentUser?.username ?? null,
		displayName: currentUser?.displayName ?? "未登录",
		avatar: currentUser?.avatar ?? null,
	};
}
