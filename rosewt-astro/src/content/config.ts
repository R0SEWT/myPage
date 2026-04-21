import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    url: z.string().url().optional(),
    published: z.boolean().default(true),
    date: z.string().optional(),
    // Hero section fields
    featured: z.boolean().default(false),
    order: z.number().optional(),
    heroLabel: z.string().optional(),
    heroDescription: z.string().optional(),
    // CV generation fields
    cvBullets: z.array(z.string()).optional(),
    cvBulletsEs: z.array(z.string()).optional(),
    cvStack: z.string().optional(),
    cvTitleEs: z.string().optional(),
  }),
});

export const collections = { projects };
