import { createServerFn } from '@tanstack/react-start'
import { db } from '../../db'
import { users } from '../../db/schema'

export const getUsers = createServerFn({ method: 'GET' }).handler(async () => {
  const items = await db.select().from(users).limit(100)
  return items
})
