import { defineConfig } from '@prisma/adapter-neon';

export default defineConfig({
  datasource: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL,
  },
});
