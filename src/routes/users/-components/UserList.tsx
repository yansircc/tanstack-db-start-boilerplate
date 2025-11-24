import { UserCard } from "./UserCard";
import type { UserDisplay } from "./types";

interface UserListProps {
	users: UserDisplay[] | undefined;
}

export function UserList({ users }: UserListProps) {
	if (!users || users.length === 0) {
		return <p className="text-gray-500">暂无用户</p>;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{users.map((user) => (
				<UserCard key={user.id} user={user} />
			))}
		</div>
	);
}
