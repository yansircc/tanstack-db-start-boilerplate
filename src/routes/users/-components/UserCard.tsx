import { Link } from "@tanstack/react-router";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditUserDialog } from "./EditUserDialog";
import { DeleteUserDialog } from "./DeleteUserDialog";
import type { UserDisplay } from "./types";

interface UserCardProps {
	user: UserDisplay;
}

export function UserCard({ user }: UserCardProps) {
	return (
		<div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition relative group">
			<Link
				to="/users/$userId"
				params={{ userId: String(user.id) }}
				className="block"
			>
				<div className="flex items-start gap-4">
					{user.avatar ? (
						<img
							src={user.avatar}
							alt={user.displayName}
							className="w-16 h-16 rounded-full"
						/>
					) : (
						<div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
							<span className="text-2xl text-gray-500">
								{user.displayName[0].toUpperCase()}
							</span>
						</div>
					)}

					<div className="flex-1 min-w-0">
						<h3 className="text-lg font-semibold truncate">
							{user.displayName}
						</h3>
						<p className="text-sm text-gray-500">@{user.username}</p>
						{user.bio && (
							<p className="text-sm text-gray-600 mt-2">{user.bio}</p>
						)}
						<p className="text-xs text-gray-400 mt-2">
							加入于 {user.createdAt.toLocaleDateString("zh-CN")}
						</p>
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
							className="h-8 w-8"
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
							variant="outline"
							className="h-8 w-8 hover:bg-red-50 hover:border-red-300"
							onClick={(e) => e.stopPropagation()}
						>
							<Trash2 className="h-4 w-4 text-red-500" />
						</Button>
					}
				/>
			</div>
		</div>
	);
}
