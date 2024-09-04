import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vitePluginSass from 'vite-plugin-sass';

export default defineConfig({ 
    plugins: [
        vitePluginSass(),
        react(),
    ],
    build: {
        rollupOptions: {
            external: ['window'],
        } 
    }
});
