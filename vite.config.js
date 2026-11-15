import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rolldownOptions: {
      input: {
        inicio: fileURLToPath(new URL('./index.html', import.meta.url)),
        registro: fileURLToPath(new URL('./pages/registration.html', import.meta.url))
      }
    }
  }
});
