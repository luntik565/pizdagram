import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle', 
  schema: './db/schema.ts',
  dialect: 'postgresql', 
  dbCredentials: {
    url: 'postgres://egor:123456@localhost:5432/messanger', // Строка подключения к PostgreSQL
  },
});