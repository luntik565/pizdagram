import { pgTable, serial, varchar, text, boolean, timestamp, integer, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';


export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  //avatar: text('avatar')
});

export const rooms = pgTable('rooms', {
  id: varchar('id', {length: 100}).primaryKey(),
  name: varchar('name', { length: 100 }),
  isGroup: boolean('is_group').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const roomMembers = pgTable('room_members', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  roomId: varchar('room_id', {length: 100})
    .notNull()
    .references(() => rooms.id, { onDelete: 'cascade' }),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('room_members_user_id_room_id_unique').on(table.userId, table.roomId)
]);

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  massage: text('massage'),
  mediaURL: text('mediaURL'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  roomId: varchar('room_id', {length: 100})
    .notNull()
    .references(() => rooms.id, { onDelete: 'cascade' }),
});

export const usersRelations = relations(users, ({ many }) => ({
  massages: many(messages),
  rooms: many(roomMembers),
}));

export const roomsRelations = relations(rooms, ({ many }) => ({
  messages: many(messages),
  members: many(roomMembers),
}));

export const roomMembersRelations = relations(roomMembers, ({ one }) => ({
  user: one(users, {
    fields: [roomMembers.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [roomMembers.roomId],
    references: [rooms.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [messages.roomId],
    references: [rooms.id],
  }),
}));