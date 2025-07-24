import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sass from 'sass';

export default defineConfig({ 
    plugins: [
        react(),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                implementation: sass, 
            },
        },
    },
    build: {
        rollupOptions: {
            external: ['window'],
            output: {
                sourcemap: false,
            }
        },
        sourcemap: false, 
    }
});
