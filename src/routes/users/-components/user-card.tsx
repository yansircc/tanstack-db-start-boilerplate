import { Link } from "@tanstack/react-router";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteUserDialog } from "./delete-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import type { UserDisplay } from "./types";

type UserCardProps = {
	user: UserDisplay;
};

export function UserCard({ user }: UserCardProps) {
	return (
		<div className="hover:-translate-y-1 group relative flex h-full flex-col rounded-sm border-2 border-foreground bg-white p-6 transition-all duration-200 hover:shadow-[4px_4px_0px_0px_var(--foreground)]">
			<Link
				className="block flex-1"
				params={{ userId: String(user.id) }}
				to="/users/$userId"
			>
				<div className="flex items-start gap-4">
					{user.avatar ? (
						<img
							alt={user.displayName}
							className="h-16 w-16 rounded-sm border-2 border-foreground bg-muted object-cover"
							height={64}
							src={user.avatar}
							width={64}
						/>
					) : (
						<div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border-2 border-foreground bg-secondary">
							<span className="font-bold font-mono text-3xl">
								{user.displayName[0].toUpperCase()}
							</span>
						</div>
					)}

					<div className="min-w-0 flex-1">
						<h3 className="truncate font-bold font-mono text-xl uppercase transition-colors group-hover:text-primary">
							{user.displayName}
						</h3>
						<p className="font-mono text-muted-foreground text-sm">
							@{user.username}
						</p>

						{user.bio && (
							<p className="mt-3 line-clamp-2 text-foreground/80 text-sm leading-relaxed">
								{user.bio}
							</p>
						)}

						<div className="mt-4 flex items-center justify-between border-foreground/10 border-t-2 pt-4">
							<p className="font-mono text-muted-foreground text-xs">
								JOINED: {user.createdAt.toLocaleDateString("zh-CN")}
							</p>
						</div>
					</div>
				</div>
			</Link>

			{/* Action buttons - shown on hover */}
			<div className="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
				<EditUserDialog
					trigger={
						<Button
							className="h-8 w-8 bg-white"
							onClick={(e) => e.stopPropagation()}
							size="icon"
							variant="outline"
						>
							<Edit className="h-4 w-4" />
						</Button>
					}
					user={user}
				/>
				<DeleteUserDialog
					trigger={
						<Button
							className="h-8 w-8"
							onClick={(e) => e.stopPropagation()}
							size="icon"
							variant="destructive"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					}
					user={user}
				/>
			</div>
		</div>
	);
}
