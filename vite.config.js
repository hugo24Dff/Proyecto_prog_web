
import { defineConfig } from 'vite';

export default defineConfig({

    server: {

        port: 5173,

        strictPort: true,

        proxy: {

            '/api': {

                target: 'http://localhost:8000',

                changeOrigin: true
            }
        }
    }
});

/*import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true
            }
        }
    }
});

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
*/