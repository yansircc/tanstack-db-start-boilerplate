import { useLiveQuery } from "@tanstack/react-db";
import { usersCollection } from "@/db/collections";

export function useUsersQuery() {
	return useLiveQuery((q) =>
		q
			.from({ user: usersCollection })
			.orderBy(({ user }) => user.createdAt, "desc")
			.select(({ user }) => ({
				id: user.id,
				username: user.username,
				displayName: user.displayName,
				email: user.email,
				avatar: user.avatar,
				bio: user.bio,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			}))
	);
}
