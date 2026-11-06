import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // É AQUI que a URL do banco deve ficar no Prisma 7:
  datasource: {
    url: env("DATABASE_URL"),
  },
});
