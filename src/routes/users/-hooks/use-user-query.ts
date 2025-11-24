import { eq, useLiveQuery } from "@tanstack/react-db";
import { usersCollection } from "@/db/collections";

export function useUserQuery(userId: number) {
	return useLiveQuery(
		(q) =>
			q
				.from({ user: usersCollection })
				.where(({ user }) => eq(user.id, userId))
				.select(({ user }) => ({
					id: user.id,
					username: user.username,
					displayName: user.displayName,
					email: user.email,
					avatar: user.avatar,
					bio: user.bio,
					createdAt: user.createdAt,
				}))
				.findOne(),
		[userId]
	);
}
