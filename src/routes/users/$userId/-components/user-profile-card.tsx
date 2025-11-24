import { useUserArticlesQuery } from "../../-hooks/use-user-articles-query";
import { useUserCommentsCountQuery } from "../../-hooks/use-user-comments-count-query";
import { useUserQuery } from "../../-hooks/use-user-query";

type UserProfileCardProps = {
	userId: number;
};

export function UserProfileCard({ userId }: UserProfileCardProps) {
	const { data: user } = useUserQuery(userId);
	const { data: articles } = useUserArticlesQuery(userId);
	const { data: comments } = useUserCommentsCountQuery(userId);

	if (!user) {
		return (
			<div className="rounded-sm border-2 border-foreground border-dashed p-12 text-center font-mono text-muted-foreground">
				User not found
			</div>
		);
	}

	const publishedCount =
		articles?.filter((a) => a.status === "published").length ?? 0;
	const totalComments = comments?.length ?? 0;

	return (
		<div className="rounded-sm border-2 border-foreground bg-white p-8 shadow-[8px_8px_0px_0px_var(--foreground)]">
			<div className="flex items-start gap-8">
				{user.avatar ? (
					<img
						alt={user.displayName}
						className="h-32 w-32 rounded-sm border-2 border-foreground bg-muted object-cover"
						height={128}
						src={user.avatar}
						width={128}
					/>
				) : (
					<div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-sm border-2 border-foreground bg-secondary">
						<span className="font-bold font-mono text-6xl text-foreground">
							{user.displayName[0].toUpperCase()}
						</span>
					</div>
				)}

				<div className="flex-1">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="font-bold font-mono text-4xl text-foreground uppercase tracking-tight">
								{user.displayName}
							</h1>
							<p className="mt-1 font-mono text-muted-foreground text-xl">
								@{user.username}
							</p>
						</div>
						<div className="rounded-sm border border-foreground/20 bg-muted px-3 py-1 font-mono text-xs">
							ID: {user.id}
						</div>
					</div>

					{user.bio && (
						<p className="mt-4 max-w-2xl border-accent border-l-4 pl-4 text-foreground text-lg leading-relaxed">
							{user.bio}
						</p>
					)}

					<div className="mt-6 flex items-center gap-8 border-foreground/10 border-t-2 pt-6">
						<div className="flex flex-col">
							<span className="font-bold font-mono text-muted-foreground text-xs uppercase">
								Articles
							</span>
							<span className="font-bold font-mono text-2xl">
								{publishedCount}
							</span>
						</div>
						<div className="flex flex-col">
							<span className="font-bold font-mono text-muted-foreground text-xs uppercase">
								Comments
							</span>
							<span className="font-bold font-mono text-2xl">
								{totalComments}
							</span>
						</div>
						<div className="ml-auto flex flex-col text-right">
							<span className="font-bold font-mono text-muted-foreground text-xs uppercase">
								Member Since
							</span>
							<span className="font-mono text-lg">
								{user.createdAt.toLocaleDateString("zh-CN")}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
