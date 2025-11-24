import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'
import { db } from '../../db'
import { articles } from '../../db/schema'

// Server function to fetch all articles
export const getArticles = createServerFn({ method: 'GET' }).handler(async () => {
  const items = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.createdAt))
    .limit(100)

  return items
})
