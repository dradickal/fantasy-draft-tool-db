import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginSass from 'vite-plugin-sass';
import sass from 'sass-embedded';

export default defineConfig({ 
    plugins: [
        // vitePluginSass(),
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
