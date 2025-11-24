import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { UserList } from "./-components/UserList";
import { CreateUserDialog } from "./-components/CreateUserDialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/users/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">用户列表</h1>
				<CreateUserDialog
					trigger={
						<Button>
							<UserPlus className="mr-2 h-4 w-4" />
							创建用户
						</Button>
					}
				/>
			</div>

			<UserList />
		</div>
	);
}
