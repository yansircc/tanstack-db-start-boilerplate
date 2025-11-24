import { createFileRoute } from "@tanstack/react-router";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CategoryDistributionCard } from "./-components/CategoryDistributionCard";
import { RecentArticlesCard } from "./-components/RecentArticlesCard";
import { StatsCards } from "./-components/StatsCards";
import { TopAuthorsCard } from "./-components/TopAuthorsCard";

export const Route = createFileRoute("/dashboard/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { currentUser, isLoggedIn, displayName } = useCurrentUser();

	return (
		<div className="max-w-[1280px] mx-auto p-8 space-y-12">
			<div className="flex items-end justify-between border-b-2 border-foreground pb-4">
				<h1 className="text-6xl font-bold tracking-tight uppercase font-mono">
					Dashboard
				</h1>
				{isLoggedIn && (
					<div className="flex items-center gap-2 text-base font-mono mb-2">
						<span>USER:</span>
						<span className="font-bold bg-secondary px-2 py-0.5 border border-foreground rounded-sm">
							{displayName}
						</span>
					</div>
				)}
			</div>

			{/* Current User Status Card */}
			<div className="bg-white border-2 border-foreground rounded-sm p-6 flex items-center gap-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-200 shadow-[4px_4px_0px_0px_var(--foreground)]">
				<div className="absolute top-0 right-0 bg-primary text-xs font-mono px-2 py-1 border-l-2 border-b-2 border-foreground">
					STATUS: {isLoggedIn ? "ONLINE" : "GUEST"}
				</div>

				{currentUser?.avatar ? (
					<img
						src={currentUser.avatar}
						alt={displayName}
						className="w-20 h-20 rounded-sm object-cover border-2 border-foreground bg-muted"
					/>
				) : (
					<div className="w-20 h-20 rounded-sm bg-secondary border-2 border-foreground flex items-center justify-center text-foreground text-3xl font-bold">
						{displayName.charAt(0).toUpperCase()}
					</div>
				)}

				<div>
					<h2 className="text-2xl font-bold font-mono uppercase mb-1">
						{isLoggedIn ? "Welcome Back" : "Hello Guest"}
					</h2>
					<div className="text-xl font-bold">{displayName}</div>
					{isLoggedIn ? (
						<div className="text-sm font-mono text-muted-foreground mt-1">
							@{currentUser?.username} · ID: {currentUser?.userId}
						</div>
					) : (
						<div className="text-sm font-mono text-muted-foreground mt-1">
							Access restricted. Please switch roles.
						</div>
					)}
				</div>
			</div>

			<div className="space-y-8">
				<section>
					<h2 className="text-2xl font-bold font-mono uppercase mb-6 flex items-center gap-2">
						<span className="w-3 h-3 bg-accent border-2 border-foreground inline-block"></span>
						Overview
					</h2>
					<StatsCards />
				</section>

				<div className="grid md:grid-cols-2 gap-8">
					<TopAuthorsCard />
					<CategoryDistributionCard />
				</div>

				<RecentArticlesCard />
			</div>
		</div>
	);
}
