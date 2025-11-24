import { createFileRoute } from "@tanstack/react-router";
import { UserDraftArticles } from "./-components/UserDraftArticles";
import { UserProfileCard } from "./-components/UserProfileCard";
import { UserPublishedArticles } from "./-components/UserPublishedArticles";
import { UserStatsCards } from "./-components/UserStatsCards";

export const Route = createFileRoute("/users/$userId/")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const { userId } = Route.useParams();
	const userIdNum = Number(userId);

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<UserProfileCard userId={userIdNum} />
			<UserStatsCards userId={userIdNum} />
			<UserPublishedArticles userId={userIdNum} />
			<UserDraftArticles userId={userIdNum} />
		</div>
	);
}
