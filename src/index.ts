import { Elysia } from "elysia";
import {z} from 'zod'
import openapi from '@elysiajs/openapi'


const app = new Elysia()

.use(openapi({
  mapJsonSchema: {
    zod: z.toJSONSchema
  }
}))

.post('/posts', ({body}) => {

  if (body.title.length > 4) {
   return new Response('titulo grande', {status: 400});
  }
  
  return {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    title: body.title,
    content: body.content,
  };

},
 {

  body: z.object({
    title: z.string().trim().min(1),
    content: z.string().optional()
  }),
  response: {
    200: z.object({
      id: z.string().uuid(),
      title: z.string(),
      content: z.string().optional(),
      createdAt: z.date()
    })
  }
})



.listen(3000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
