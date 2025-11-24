import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'
import { db } from '../../db'
import { comments } from '../../db/schema'

export const getComments = createServerFn({ method: 'GET' }).handler(async () => {
  const items = await db
    .select()
    .from(comments)
    .orderBy(desc(comments.createdAt))
    .limit(200)

  return items
})
