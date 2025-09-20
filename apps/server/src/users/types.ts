import type { Prisma } from "../../external/prisma/generated/client"

export type { User, PixTransaction as PixHistory } from "../../external/prisma/generated/client"

export type CreateUserRequest = Prisma.UserCreateInput
export type UpdateUserRequest = Prisma.UserUpdateInput
