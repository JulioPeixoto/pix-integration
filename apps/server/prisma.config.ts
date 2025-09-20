import "dotenv/config";
import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  schema: path.join("external", "prisma", "schema"),
  migrations: {
    path: path.join("external", "prisma", "migrations"),
  }
} satisfies PrismaConfig;
