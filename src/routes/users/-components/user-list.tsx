import { useUsersQuery } from "../-hooks/use-users-query";
import { UserCard } from "./user-card";

export function UserList() {
	const { data: users } = useUsersQuery();

	if (!users || users.length === 0) {
		return (
			<div className="rounded-sm border-2 border-foreground border-dashed p-12 text-center">
				<p className="font-mono text-lg text-muted-foreground uppercase">
					No users found.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{users.map((user) => (
				<UserCard key={user.id} user={user} />
			))}
		</div>
	);
}
