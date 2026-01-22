import { defineConfig } from "drizzle-kit";
import { config } from 'dotenv';

config({ path: '.env.local' });

export default defineConfig({
  dialect: "sqlite",
  schema: "./db/schema.ts",
  out: "./drizzle",
});
