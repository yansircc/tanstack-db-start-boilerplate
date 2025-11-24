import { Link } from "@tanstack/react-router";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import type { UserDisplay } from "./types";

interface UserCardProps {
	user: UserDisplay;
}

export function UserCard({ user }: UserCardProps) {
	return (
		<div className="border-2 border-foreground rounded-sm p-6 hover:shadow-[4px_4px_0px_0px_var(--foreground)] hover:-translate-y-1 transition-all duration-200 relative group bg-white flex flex-col h-full">
			<Link
				to="/users/$userId"
				params={{ userId: String(user.id) }}
				className="flex-1 block"
			>
				<div className="flex items-start gap-4">
					{user.avatar ? (
						<img
							src={user.avatar}
							alt={user.displayName}
							className="w-16 h-16 rounded-sm border-2 border-foreground object-cover bg-muted"
						/>
					) : (
						<div className="w-16 h-16 rounded-sm border-2 border-foreground bg-secondary flex items-center justify-center shrink-0">
							<span className="text-3xl font-bold font-mono">
								{user.displayName[0].toUpperCase()}
							</span>
						</div>
					)}

					<div className="flex-1 min-w-0">
						<h3 className="text-xl font-bold truncate font-mono uppercase group-hover:text-primary transition-colors">
							{user.displayName}
						</h3>
						<p className="text-sm font-mono text-muted-foreground">@{user.username}</p>
						
						{user.bio && (
							<p className="text-sm text-foreground/80 mt-3 line-clamp-2 leading-relaxed">
								{user.bio}
							</p>
						)}
						
						<div className="mt-4 pt-4 border-t-2 border-foreground/10 flex items-center justify-between">
							<p className="text-xs font-mono text-muted-foreground">
								JOINED: {user.createdAt.toLocaleDateString("zh-CN")}
							</p>
						</div>
					</div>
				</div>
			</Link>

			{/* Action buttons - shown on hover */}
			<div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
				<EditUserDialog
					user={user}
					trigger={
						<Button
							size="icon"
							variant="outline"
							className="h-8 w-8 bg-white"
							onClick={(e) => e.stopPropagation()}
						>
							<Edit className="h-4 w-4" />
						</Button>
					}
				/>
				<DeleteUserDialog
					user={user}
					trigger={
						<Button
							size="icon"
							variant="destructive"
							className="h-8 w-8"
							onClick={(e) => e.stopPropagation()}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					}
				/>
			</div>
		</div>
	);
}
