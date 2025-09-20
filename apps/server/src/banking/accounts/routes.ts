import { Elysia, t } from "elysia"
import { BankAccountService } from "./service"
import { CreateBankAccountSchema, UpdateBankAccountSchema, BankAccountResponseSchema } from "./schema"

export const bankAccountRouter = new Elysia({ prefix: "/accounts" })
  .get(
    "/:id",
    async ({ params }) => {
      const account = await BankAccountService.getBankAccount(params.id)
      if (!account) {
        throw new Error("Bank account not found")
      }
      return account
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: BankAccountResponseSchema,
        404: t.String(),
      },
    }
  )

  .post(
    "/",
    async ({ body }) => {
      return await BankAccountService.createBankAccount(body)
    },
    {
      body: CreateBankAccountSchema,
      response: {
        201: BankAccountResponseSchema,
        400: t.String(),
      },
    }
  )

  .put(
    "/:id",
    async ({ params, body }) => {
      return await BankAccountService.updateBankAccount(params.id, body)
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: UpdateBankAccountSchema,
      response: {
        200: BankAccountResponseSchema,
        404: t.String(),
      },
    }
  )

  .delete(
    "/:id",
    async ({ params }) => {
      const success = await BankAccountService.deleteBankAccount(params.id)
      return { success }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
        }),
      },
    }
  )
