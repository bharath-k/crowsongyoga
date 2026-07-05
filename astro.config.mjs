import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Update `site` to your final Netlify (or custom) URL when you deploy.
export default defineConfig({
  site: 'https://your-shala.netlify.app',
  vite: {
    plugins: [tailwindcss()],
  },
});
