import { Elysia } from "elysia";
import * as z from 'zod'
import openapi from '@elysiajs/openapi';
import { db } from "./db";
import { postsTable } from "./db/schema";
import { auth, OpenAPI } from "./lib/auth";
import { betterAuth } from "./macros/auth";


const app = new Elysia()
  .mount(auth.handler)
  .use(betterAuth)

  .use(openapi({
    mapJsonSchema: {
      zod: z.toJSONSchema
    },
    
    documentation: {
      components: await OpenAPI.components,
      paths: await OpenAPI.getPaths()
    }

  }))


  .post("/posts", async ({ body, user }) => {

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
        content: result.content,
        verified: user.emailVerified,
        user: user.email
      };
    },
    {
      auth: true,
      body: z.object({
        title: z.string().min(1),
        content: z.string().min(1)
      }),
      response: {
        200: z.object({
          id: z.string().uuid(),
          title: z.string(),
          content: z.string(),
          user: z.string().email(),
          verified: z.boolean()
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
