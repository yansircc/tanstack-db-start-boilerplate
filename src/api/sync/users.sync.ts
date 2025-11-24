import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { users } from '../../db/schema'
import type { InsertUser, UpdateUser } from '../../db/schemas-zod'

export const getUsers = createServerFn({ method: 'GET' }).handler(async () => {
  const items = await db.select().from(users).limit(100)
  return items
})

export const createUser = createServerFn({ method: 'POST' })
  .inputValidator((data: InsertUser) => data)
  .handler(async ({ data }) => {
    const [newUser] = await db
      .insert(users)
      .values({
        username: data.username,
        email: data.email,
        displayName: data.displayName,
        avatar: data.avatar,
        bio: data.bio,
      })
      .returning()

    return newUser
  })

export const updateUser = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: number; changes: UpdateUser }) => data)
  .handler(async ({ data }) => {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...data.changes,
        updatedAt: new Date(),
      })
      .where(eq(users.id, data.id))
      .returning()

    return updatedUser
  })

export const deleteUser = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(users).where(eq(users.id, data.id))

    return { success: true, id: data.id }
  })
