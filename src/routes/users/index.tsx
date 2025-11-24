import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateUserDialog } from "./-components/CreateUserDialog";
import { UserList } from "./-components/UserList";

export const Route = createFileRoute("/users/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="max-w-[1280px] mx-auto p-8 space-y-8">
			<div className="flex items-end justify-between border-b-2 border-foreground pb-4">
				<div>
					<h1 className="text-6xl font-bold tracking-tight uppercase font-mono">
						Users
					</h1>
					<p className="text-lg text-muted-foreground font-mono mt-2">
						Community members and authors.
					</p>
				</div>
				<CreateUserDialog
					trigger={
						<Button>
							<UserPlus className="mr-2 h-4 w-4" />
							New User
						</Button>
					}
				/>
			</div>

			<UserList />
		</div>
	);
}
