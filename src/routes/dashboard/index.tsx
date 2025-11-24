import { createFileRoute } from "@tanstack/react-router";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CategoryDistributionCard } from "./-components/category-distribution-card";
import { RecentArticlesCard } from "./-components/recent-articles-card";
import { StatsCards } from "./-components/stats-cards";
import { TopAuthorsCard } from "./-components/top-authors-card";

export const Route = createFileRoute("/dashboard/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { currentUser, isLoggedIn, displayName } = useCurrentUser();

	return (
		<div className="mx-auto max-w-[1280px] space-y-12 p-8">
			<div className="flex items-end justify-between border-foreground border-b-2 pb-4">
				<h1 className="font-bold font-mono text-6xl uppercase tracking-tight">
					Dashboard
				</h1>
				{isLoggedIn && (
					<div className="mb-2 flex items-center gap-2 font-mono text-base">
						<span>USER:</span>
						<span className="rounded-sm border border-foreground bg-secondary px-2 py-0.5 font-bold">
							{displayName}
						</span>
					</div>
				)}
			</div>

			{/* Current User Status Card */}
			<div className="group hover:-translate-y-1 relative flex items-center gap-6 overflow-hidden rounded-sm border-2 border-foreground bg-white p-6 shadow-[4px_4px_0px_0px_var(--foreground)] transition-transform duration-200">
				<div className="absolute top-0 right-0 border-foreground border-b-2 border-l-2 bg-primary px-2 py-1 font-mono text-xs">
					STATUS: {isLoggedIn ? "ONLINE" : "GUEST"}
				</div>

				{currentUser?.avatar ? (
					<img
						alt={displayName}
						className="h-20 w-20 rounded-sm border-2 border-foreground bg-muted object-cover"
						height={80}
						src={currentUser.avatar}
						width={80}
					/>
				) : (
					<div className="flex h-20 w-20 items-center justify-center rounded-sm border-2 border-foreground bg-secondary font-bold text-3xl text-foreground">
						{displayName.charAt(0).toUpperCase()}
					</div>
				)}

				<div>
					<h2 className="mb-1 font-bold font-mono text-2xl uppercase">
						{isLoggedIn ? "Welcome Back" : "Hello Guest"}
					</h2>
					<div className="font-bold text-xl">{displayName}</div>
					{isLoggedIn ? (
						<div className="mt-1 font-mono text-muted-foreground text-sm">
							@{currentUser?.username} · ID: {currentUser?.userId}
						</div>
					) : (
						<div className="mt-1 font-mono text-muted-foreground text-sm">
							Access restricted. Please switch roles.
						</div>
					)}
				</div>
			</div>

			<div className="space-y-8">
				<section>
					<h2 className="mb-6 flex items-center gap-2 font-bold font-mono text-2xl uppercase">
						<span className="inline-block h-3 w-3 border-2 border-foreground bg-accent" />
						Overview
					</h2>
					<StatsCards />
				</section>

				<div className="grid gap-8 md:grid-cols-2">
					<TopAuthorsCard />
					<CategoryDistributionCard />
				</div>

				<RecentArticlesCard />
			</div>
		</div>
	);
}
