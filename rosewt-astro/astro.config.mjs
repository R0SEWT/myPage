// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rosewt.dev',
  output: 'static',
  base: '/',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx(), 
    react(), 
    sitemap({
      customPages: [
        'https://rosewt.dev/',
        'https://rosewt.dev/gracias'
      ],
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES'
        }
      },
      serialize(item) {
        // Configurar prioridades y frecuencias
        if (item.url === 'https://rosewt.dev/') {
          item.priority = 1.0;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (item.url.includes('/gracias')) {
          item.priority = 0.3;
          item.changefreq = ChangeFreqEnum.YEARLY;
        } else {
          item.priority = 0.7;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        }
        item.lastmod = new Date().toISOString();
        return item;
      }
    })
  ],
});

