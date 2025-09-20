import { Elysia } from "elysia"
import { bankAccountRouter } from "./accounts/routes"
import { pixRouter } from "./pix/routes"

export const bankingRouter = new Elysia({ prefix: "/banking" }).use(bankAccountRouter).use(pixRouter)
