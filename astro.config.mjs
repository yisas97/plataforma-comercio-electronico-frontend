// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [],
  output: "server",
  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.BACKEND_SECURITY_API_URL': JSON.stringify(process.env.BACKEND_SECURITY_API_URL),
    },
  },
  adapter: netlify()
});