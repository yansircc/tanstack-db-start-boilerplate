import { createServerFn } from '@tanstack/react-start'
import { db } from '../../db'
import { tags } from '../../db/schema'

export const getTags = createServerFn({ method: 'GET' }).handler(async () => {
  const items = await db.select().from(tags).limit(100)
  return items
})
