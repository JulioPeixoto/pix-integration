import { Elysia } from "elysia"
import { PixTransactionSchema } from "./schema"
import { PixService } from "./service"
import type { PixTransferRequest } from "external/itau/types"

const pixService = new PixService()

export const pixRouter = new Elysia({ prefix: "/pix" })
  .get("/", () => {
    return "Hello World"
  })

  .post("/transfers", async ({ body }: { body: PixTransferRequest }) => {
    return await pixService.transferPix(body)
  },
    {
      body: PixTransactionSchema,
    }
  )