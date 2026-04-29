import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { globSync } from "glob";
import { readFileSync, writeFileSync } from "fs";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
    plugins: [
        react(),
        {
            name: 'minify-locales-json',
            apply: 'build',
            closeBundle() {
                const localesDir = path.resolve(__dirname, 'dist/locales');
                const files = globSync(`${localesDir}/**/*.json`);

                files.forEach((filePath) => {
                    try {
                        const content = readFileSync(filePath, 'utf-8');
                        const minified = JSON.stringify(JSON.parse(content));
                        writeFileSync(filePath, minified);
                    } catch (err) {
                        console.error(`Error minifying ${filePath}:`, err);
                    }
                });
            }
        }
    ],
    
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
