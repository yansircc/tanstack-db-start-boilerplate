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
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">数据面板</h1>
				{isLoggedIn && (
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<span>欢迎,</span>
						<span className="font-semibold text-gray-900">{displayName}</span>
					</div>
				)}
			</div>

			{/* 当前用户状态卡片 */}
			<div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
				<h2 className="text-lg font-semibold mb-3 text-gray-900">
					当前登录状态
				</h2>
				<div className="flex items-center gap-4">
					{currentUser?.avatar ? (
						<img
							src={currentUser.avatar}
							alt={displayName}
							className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
						/>
					) : (
						<div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow">
							{displayName.charAt(0).toUpperCase()}
						</div>
					)}
					<div>
						<div className="text-xl font-bold text-gray-900">{displayName}</div>
						{isLoggedIn ? (
							<div className="text-sm text-gray-600">
								@{currentUser?.username} (ID: {currentUser?.userId})
							</div>
						) : (
							<div className="text-sm text-gray-600">
								请点击右上角切换角色以"伪登录"
							</div>
						)}
					</div>
				</div>
			</div>

			<StatsCards />

			<div className="grid md:grid-cols-2 gap-6">
				<TopAuthorsCard />
				<CategoryDistributionCard />
			</div>

			<RecentArticlesCard />
		</div>
	);
}
