import { faker } from "@faker-js/faker";
import Database from "better-sqlite3";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

config();

const sqlite = new Database(process.env.DATABASE_URL || "dev.db");
const db = drizzle(sqlite, { schema });

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

async function clearExistingData() {
	console.log("🗑️  Clearing existing data...");
	await db.delete(schema.articleBookmarks);
	await db.delete(schema.articleLikes);
	await db.delete(schema.comments);
	await db.delete(schema.articleTags);
	await db.delete(schema.articles);
	await db.delete(schema.tags);
	await db.delete(schema.categories);
	await db.delete(schema.users);
}

async function seedUsers(): Promise<number[]> {
	console.log("👥 Creating users...");
	const userIds: number[] = [];

	for (let i = 0; i < 10; i++) {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();
		const username = faker.internet.username({ firstName, lastName });

		const [user] = await db
			.insert(schema.users)
			.values({
				username,
				email: faker.internet.email({ firstName, lastName }),
				displayName: `${firstName} ${lastName}`,
				avatar: faker.image.avatar(),
				bio: faker.lorem.sentence(),
				createdAt: faker.date.past({ years: 2 }),
				updatedAt: new Date(),
			})
			.returning();

		userIds.push(user.id);
	}

	console.log(`✅ Created ${userIds.length} users`);
	return userIds;
}

async function seedCategories(): Promise<number[]> {
	console.log("📂 Creating categories...");
	const categoryNames = [
		"Technology",
		"Programming",
		"Design",
		"Business",
		"Science",
		"Health",
		"Travel",
		"Food",
	];
	const categoryIds: number[] = [];

	for (const name of categoryNames) {
		const [category] = await db
			.insert(schema.categories)
			.values({
				name,
				slug: slugify(name),
				description: faker.lorem.sentence(),
				createdAt: faker.date.past({ years: 1 }),
			})
			.returning();

		categoryIds.push(category.id);
	}

	console.log(`✅ Created ${categoryIds.length} categories`);
	return categoryIds;
}

async function seedTags(): Promise<number[]> {
	console.log("🏷️  Creating tags...");
	const tagNames = [
		"JavaScript",
		"TypeScript",
		"React",
		"Node.js",
		"Python",
		"AI",
		"Machine Learning",
		"Web Development",
		"Mobile",
		"DevOps",
		"Cloud",
		"Database",
		"Security",
		"Testing",
		"Performance",
		"UI/UX",
		"API",
		"Microservices",
		"Docker",
		"Kubernetes",
	];
	const tagIds: number[] = [];

	for (const name of tagNames) {
		const [tag] = await db
			.insert(schema.tags)
			.values({
				name,
				slug: slugify(name),
				createdAt: faker.date.past({ years: 1 }),
			})
			.returning();

		tagIds.push(tag.id);
	}

	console.log(`✅ Created ${tagIds.length} tags`);
	return tagIds;
}

async function seedArticles(
	userIds: number[],
	categoryIds: number[],
	tagIds: number[]
): Promise<number[]> {
	console.log("📝 Creating articles...");
	const articleIds: number[] = [];
	const statuses = ["draft", "published", "archived"] as const;

	for (let i = 0; i < 50; i++) {
		const title = faker.lorem.sentence({ min: 3, max: 8 });
		const status = faker.helpers.arrayElement(statuses);
		const createdAt = faker.date.past({ years: 1 });

		const [article] = await db
			.insert(schema.articles)
			.values({
				title,
				slug: `${slugify(title)}-${faker.string.alphanumeric(6)}`,
				content: faker.lorem.paragraphs({ min: 5, max: 15 }, "\n\n"),
				excerpt: faker.lorem.paragraph(),
				coverImage: faker.image.url({ width: 1200, height: 630 }),
				status,
				viewCount:
					status === "published" ? faker.number.int({ min: 0, max: 5000 }) : 0,
				authorId: faker.helpers.arrayElement(userIds),
				categoryId: faker.helpers.arrayElement(categoryIds),
				publishedAt: status === "published" ? createdAt : null,
				createdAt,
				updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
				deletedAt: null,
			})
			.returning();

		articleIds.push(article.id);

		// Add 2-5 tags to each article
		const numTags = faker.number.int({ min: 2, max: 5 });
		const selectedTags = faker.helpers.arrayElements(tagIds, numTags);

		for (const tagId of selectedTags) {
			await db.insert(schema.articleTags).values({
				articleId: article.id,
				tagId,
				createdAt: article.createdAt,
			});
		}
	}

	console.log(`✅ Created ${articleIds.length} articles with tags`);
	return articleIds;
}

async function seedComments(
	articleIds: number[],
	userIds: number[]
): Promise<number[]> {
	console.log("💬 Creating comments...");
	const commentIds: number[] = [];
	const publishedArticles = articleIds.slice(0, 40);

	for (let i = 0; i < 200; i++) {
		const articleId = faker.helpers.arrayElement(publishedArticles);
		const createdAt = faker.date.recent({ days: 180 });

		const parentId =
			commentIds.length > 0 && faker.datatype.boolean({ probability: 0.2 })
				? faker.helpers.arrayElement(commentIds)
				: null;

		const [comment] = await db
			.insert(schema.comments)
			.values({
				content: faker.lorem.paragraph({ min: 1, max: 3 }),
				articleId,
				authorId: faker.helpers.arrayElement(userIds),
				parentId,
				createdAt,
				updatedAt: createdAt,
				deletedAt: null,
			})
			.returning();

		commentIds.push(comment.id);
	}

	console.log(`✅ Created ${commentIds.length} comments`);
	return commentIds;
}

async function seedArticleLikes(
	articleIds: number[],
	userIds: number[]
): Promise<number> {
	console.log("👍 Creating article likes...");
	const likesCount = faker.number.int({ min: 300, max: 500 });
	const likeSet = new Set<string>();

	for (let i = 0; i < likesCount; i++) {
		const articleId = faker.helpers.arrayElement(articleIds);
		const userId = faker.helpers.arrayElement(userIds);
		const key = `${articleId}-${userId}`;

		if (!likeSet.has(key)) {
			likeSet.add(key);
			await db.insert(schema.articleLikes).values({
				articleId,
				userId,
				createdAt: faker.date.recent({ days: 180 }),
			});
		}
	}

	console.log(`✅ Created ${likeSet.size} article likes`);
	return likeSet.size;
}

async function seedArticleBookmarks(
	articleIds: number[],
	userIds: number[]
): Promise<number> {
	console.log("🔖 Creating article bookmarks...");
	const bookmarksCount = faker.number.int({ min: 150, max: 250 });
	const bookmarkSet = new Set<string>();

	for (let i = 0; i < bookmarksCount; i++) {
		const articleId = faker.helpers.arrayElement(articleIds);
		const userId = faker.helpers.arrayElement(userIds);
		const key = `${articleId}-${userId}`;

		if (!bookmarkSet.has(key)) {
			bookmarkSet.add(key);
			await db.insert(schema.articleBookmarks).values({
				articleId,
				userId,
				createdAt: faker.date.recent({ days: 180 }),
			});
		}
	}

	console.log(`✅ Created ${bookmarkSet.size} article bookmarks`);
	return bookmarkSet.size;
}

async function seed() {
	console.log("🌱 Seeding database...");

	try {
		await clearExistingData();

		const userIds = await seedUsers();
		const categoryIds = await seedCategories();
		const tagIds = await seedTags();
		const articleIds = await seedArticles(userIds, categoryIds, tagIds);
		const commentIds = await seedComments(articleIds, userIds);
		const likesCount = await seedArticleLikes(articleIds, userIds);
		const bookmarksCount = await seedArticleBookmarks(articleIds, userIds);

		console.log("🎉 Seeding completed successfully!");
		console.log("\n📊 Summary:");
		console.log(`   - ${userIds.length} users`);
		console.log(`   - ${categoryIds.length} categories`);
		console.log(`   - ${tagIds.length} tags`);
		console.log(`   - ${articleIds.length} articles`);
		console.log(`   - ${commentIds.length} comments`);
		console.log(`   - ${likesCount} likes`);
		console.log(`   - ${bookmarksCount} bookmarks`);
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		throw error;
	} finally {
		sqlite.close();
	}
}

seed();
