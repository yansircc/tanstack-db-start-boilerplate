import { createServerFn } from '@tanstack/react-start'
import { db } from '../../db'
import { categories } from '../../db/schema'

export const getCategories = createServerFn({ method: 'GET' }).handler(async () => {
  const items = await db.select().from(categories).limit(100)
  return items
})
