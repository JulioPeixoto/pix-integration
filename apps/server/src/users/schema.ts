import { UserPlain, UserPlainInputCreate, UserPlainInputUpdate } from "../../external/prisma/generated/prismabox/User"
import { t } from "elysia"

export const CreateUserSchema = UserPlainInputCreate
export const UpdateUserSchema = UserPlainInputUpdate
export const UserResponseSchema = UserPlain

export const UserParamsSchema = t.Object({
  id: t.String(),
})
