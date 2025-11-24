import { useUserArticlesQuery } from "../../-hooks/useUserArticlesQuery";
import { useUserCommentsCountQuery } from "../../-hooks/useUserCommentsCountQuery";
import { useUserQuery } from "../../-hooks/useUserQuery";

interface UserProfileCardProps {
	userId: number;
}

export function UserProfileCard({ userId }: UserProfileCardProps) {
	const { data: user } = useUserQuery(userId);
	const { data: articles } = useUserArticlesQuery(userId);
	const { data: comments } = useUserCommentsCountQuery(userId);

	if (!user) {
		return (
			<div className="border-2 border-foreground border-dashed rounded-sm p-12 text-center text-muted-foreground font-mono">
				User not found
			</div>
		);
	}

	const publishedCount =
		articles?.filter((a) => a.status === "published").length ?? 0;
	const totalComments = comments?.length ?? 0;

	return (
		<div className="bg-white border-2 border-foreground rounded-sm p-8 shadow-[8px_8px_0px_0px_var(--foreground)]">
			<div className="flex items-start gap-8">
				{user.avatar ? (
					<img
						src={user.avatar}
						alt={user.displayName}
						className="w-32 h-32 rounded-sm border-2 border-foreground object-cover bg-muted"
					/>
				) : (
					<div className="w-32 h-32 rounded-sm border-2 border-foreground bg-secondary flex items-center justify-center shrink-0">
						<span className="text-6xl font-bold font-mono text-foreground">
							{user.displayName[0].toUpperCase()}
						</span>
					</div>
				)}

				<div className="flex-1">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-4xl font-bold font-mono text-foreground uppercase tracking-tight">
								{user.displayName}
							</h1>
							<p className="text-muted-foreground font-mono text-xl mt-1">@{user.username}</p>
						</div>
						<div className="bg-muted px-3 py-1 rounded-sm border border-foreground/20 text-xs font-mono">
							ID: {user.id}
						</div>
					</div>

					{user.bio && (
						<p className="text-foreground text-lg mt-4 leading-relaxed max-w-2xl border-l-4 border-accent pl-4">
							{user.bio}
						</p>
					)}

					<div className="flex items-center gap-8 mt-6 pt-6 border-t-2 border-foreground/10">
						<div className="flex flex-col">
							<span className="text-xs font-mono font-bold uppercase text-muted-foreground">Articles</span>
							<span className="text-2xl font-bold font-mono">{publishedCount}</span>
						</div>
						<div className="flex flex-col">
							<span className="text-xs font-mono font-bold uppercase text-muted-foreground">Comments</span>
							<span className="text-2xl font-bold font-mono">{totalComments}</span>
						</div>
						<div className="flex flex-col ml-auto text-right">
							<span className="text-xs font-mono font-bold uppercase text-muted-foreground">Member Since</span>
							<span className="text-lg font-mono">{user.createdAt.toLocaleDateString("zh-CN")}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
