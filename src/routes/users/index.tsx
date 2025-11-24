import { createFileRoute } from "@tanstack/react-router";
import { UserList } from "./-components/UserList";

export const Route = createFileRoute("/users/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<h1 className="text-3xl font-bold">用户列表</h1>
			<UserList />
		</div>
	);
}
