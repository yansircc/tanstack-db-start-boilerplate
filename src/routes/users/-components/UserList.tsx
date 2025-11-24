import { useUsersQuery } from "../-hooks/useUsersQuery";
import { UserCard } from "./UserCard";

export function UserList() {
	const { data: users } = useUsersQuery();

	if (!users || users.length === 0) {
		return (
			<div className="border-2 border-foreground border-dashed rounded-sm p-12 text-center">
				<p className="text-muted-foreground font-mono text-lg uppercase">No users found.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{users.map((user) => (
				<UserCard key={user.id} user={user} />
			))}
		</div>
	);
}
