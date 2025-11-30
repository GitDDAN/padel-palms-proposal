import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
        // REMOVED 'base: /padelandpalms/'
        // This makes the site load correctly from the root URL (/) on Netlify.
        
        server: {
            port: 3000,
            host: '0.0.0.0', // Allows access from external IPs during development
        },
        plugins: [react()],
        define: {
            // Your environment variables for API keys
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
        },
        resolve: {
            alias: {
                // Sets up the '@' alias to resolve paths from the current directory
                '@': path.resolve(__dirname, '.'),
            }
        }
    };
});