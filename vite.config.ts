import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
    plugins: [react()],
    build: {
        target: "esnext",
        cssMinify: true,
        chunkSizeWarningLimit: 1000,
        
        rolldownOptions: {
            output: {
                manualChunks: (id: string) => {
                    if (id.includes("node_modules")) {
                        if (id.includes('react')) return 'vendor-react';
                        if (id.includes('html5-qrcode')) return 'vendor-qr';
                        if (id.includes('lucide')) return 'vendor-icons';
                        
                        return 'vendor-others';
                    }
                },
            },
        },
    },

    resolve: {
        alias: [
            { find: '@', replacement: '/src' },
        ],
    },

    clearScreen: false,

    server: {
        port: 1420,
        strictPort: true,
        host: host || false,
        hmr: host
            ? {
                protocol: "ws",
                host,
                port: 1421,
            }
            : undefined,
        watch: {
            ignored: ["**/src-tauri/**"],
        },
    },
}));
