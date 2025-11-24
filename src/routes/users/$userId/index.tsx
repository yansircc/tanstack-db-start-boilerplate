import { createFileRoute } from "@tanstack/react-router";
import { UserArchivedArticles } from "./-components/user-archived-articles";
import { UserBookmarkedArticles } from "./-components/user-bookmarked-articles";
import { UserDraftArticles } from "./-components/user-draft-articles";
import { UserLikedArticles } from "./-components/user-liked-articles";
import { UserProfileCard } from "./-components/user-profile-card";
import { UserPublishedArticles } from "./-components/user-published-articles";
import { UserStatsCards } from "./-components/user-stats-cards";

export const Route = createFileRoute("/users/$userId/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { userId } = Route.useParams();
	const userIdNum = Number(userId);

	return (
		<div className="mx-auto max-w-[1280px] space-y-8 p-8">
			<UserProfileCard userId={userIdNum} />
			<UserStatsCards userId={userIdNum} />
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
