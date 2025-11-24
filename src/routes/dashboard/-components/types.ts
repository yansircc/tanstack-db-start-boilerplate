export type Stats = {
	totalArticles: number;
	totalUsers: number;
	totalCategories: number;
	totalTags: number;
	totalComments: number;
};

export type TopAuthor = {
	authorId: number;
	authorName: string;
	avatar: string | null;
	articleCount: number;
};

export type RecentArticle = {
	id: number;
	title: string;
	createdAt: Date;
	viewCount: number;
	authorName: string | undefined;
};

export type CategoryStat = {
	categoryId: number;
	categoryName: string;
	articleCount: number;
};
