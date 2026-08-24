import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        survey: fileURLToPath(new URL('./survey.html', import.meta.url)),
        journeys: fileURLToPath(new URL('./journeys.html', import.meta.url)),
      },
    },
  },
  server: {
    open: true,
  },
});
