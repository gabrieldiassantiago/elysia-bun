import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const postsTable = pgTable("posts", {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    content: text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
})
