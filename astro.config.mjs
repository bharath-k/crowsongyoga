import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// `site` is the public address of the website, used for canonical URLs.
export default defineConfig({
  site: 'https://crowsongyoga.ca',
  vite: {
    plugins: [tailwindcss()],
  },
});
