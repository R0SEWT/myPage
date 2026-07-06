import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),           // one line: what the system does
    result: z.string(),            // one highlighted outcome line (▸ in UI)
    status: z.string(),            // e.g. "Restricted", "Live demo", "Stable"
    stack: z.array(z.string()),
    links: z.object({
      github: z.string().url().optional(),
      demo: z.string().url().optional(),
      poster: z.string().url().optional(),
    }).default({}),
    media: z.string().optional(),   // path under /assets/projects/
    mediaAlt: z.string().optional(),
    order: z.number(),
  }),
});

export const collections = { projects };
