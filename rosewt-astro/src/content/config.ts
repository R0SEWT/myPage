import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    url: z.string().url().optional(),
    published: z.boolean().default(true),
    date: z.string().optional()
  })
});

export const collections = { projects };
