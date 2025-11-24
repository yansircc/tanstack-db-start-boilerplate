import { createFileRoute } from "@tanstack/react-router";
import { UserArchivedArticles } from "./-components/UserArchivedArticles";
import { UserDraftArticles } from "./-components/UserDraftArticles";
import { UserProfileCard } from "./-components/UserProfileCard";
import { UserPublishedArticles } from "./-components/UserPublishedArticles";
import { UserStatsCards } from "./-components/UserStatsCards";
import { UserLikedArticles } from "./-components/UserLikedArticles";
import { UserBookmarkedArticles } from "./-components/UserBookmarkedArticles";

export const Route = createFileRoute("/users/$userId/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { userId } = Route.useParams();
	const userIdNum = Number(userId);

	return (
		<div className="max-w-[1280px] mx-auto p-8 space-y-8">
			<UserProfileCard userId={userIdNum} />
			<UserStatsCards userId={userIdNum} />
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="space-y-8">
					<UserPublishedArticles userId={userIdNum} />
					<UserDraftArticles userId={userIdNum} />
					<UserArchivedArticles userId={userIdNum} />
				</div>
				<div className="space-y-8">
					<UserLikedArticles userId={userIdNum} />
					<UserBookmarkedArticles userId={userIdNum} />
				</div>
			</div>
		</div>
	);
}
