import { Elysia } from "elysia"
import { UserService } from "./service"
import { CreateUserSchema, UpdateUserSchema, UserParamsSchema } from "./schema"

export const usersRouter = new Elysia({ prefix: "/users" })
  .get(
    "/:id",
    async ({ params }) => {
      const user = await UserService.getUser(params.id)
      if (!user) {
        throw new Error("User not found")
      }
      return user
    },
    {
      params: UserParamsSchema,
    }
  )

  .post(
    "/",
    async ({ body }) => {
      return await UserService.createUser(body)
    },
    {
      body: CreateUserSchema,
    }
  )

  .put(
    "/:id",
    async ({ params, body }) => {
      return await UserService.updateUser(params.id, body)
    },
    {
      params: UserParamsSchema,
      body: UpdateUserSchema,
    }
  )

  .delete(
    "/:id",
    async ({ params }) => {
      return await UserService.deleteUser(params.id)
    },
    {
      params: UserParamsSchema,
    }
  )

  .get(
    "/:id/pix-history",
    async ({ params }) => {
      return await UserService.getUserPixHistory(params.id)
    },
    {
      params: UserParamsSchema,
    }
  )
