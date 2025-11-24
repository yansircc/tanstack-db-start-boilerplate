import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateUserDialog } from "./-components/create-user-dialog";
import { UserList } from "./-components/user-list";

export const Route = createFileRoute("/users/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="mx-auto max-w-[1280px] space-y-8 p-8">
			<div className="flex items-end justify-between border-foreground border-b-2 pb-4">
				<div>
					<h1 className="font-bold font-mono text-6xl uppercase tracking-tight">
						Users
					</h1>
					<p className="mt-2 font-mono text-lg text-muted-foreground">
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
