import { Elysia } from "elysia";
import { z } from 'zod';
import openapi from '@elysiajs/openapi';
import { db } from "./db";
import { postsTable } from "./db/schema";


const app = new Elysia()

  .use(openapi({
    mapJsonSchema: {
      zod: z.toJSONSchema
    }
  }))

  .post("/posts", async ({ body }) => {

      const [result] = await db.insert(postsTable).values({
        title: body.title,
        content: body.content,
      }).returning({
        id: postsTable.id,
        title: postsTable.title,
        content: postsTable.content
      });
      return {
        id: result.id,
        title: result.title,
        content: result.content
      };
    },
    {
      body: z.object({
        title: z.string().min(1),
        content: z.string().min(1)
      }),
      response: {
        200: z.object({
          id: z.string().uuid(),
          title: z.string(),
          content: z.string()
        })
      },
      description: "Create a new post",
      summary: "Create Post"
    }
)

  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
