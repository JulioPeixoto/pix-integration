import { Elysia } from "elysia"

export const pixRouter = new Elysia({ prefix: "/pix" })
  .get("/", () => {
    return "Hello World"
  })