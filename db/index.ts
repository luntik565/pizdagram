import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const queryClient = postgres('postgres://egor:123456@localhost:5432/messanger');
export const db = drizzle(queryClient, { schema });