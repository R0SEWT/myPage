// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rosewt.dev',  // necesario para sitemap y canonical
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), react(), sitemap()],
});
