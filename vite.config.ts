import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    server: {
      port: 3000,
      host: '0.0.0.0'
    },

    plugins: [react()],

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        // Fix for micromark-extension-gfm-strikethrough and other extensions ESM build error
        'micromark-extension-gfm-strikethrough': path.resolve(__dirname, 'node_modules/micromark-extension-gfm-strikethrough/dev/index.js'),
        'micromark-extension-gfm-strikethrough/html': path.resolve(__dirname, 'node_modules/micromark-extension-gfm-strikethrough/dev/html.js'),
        'micromark-extension-gfm-autolink-literal': path.resolve(__dirname, 'node_modules/micromark-extension-gfm-autolink-literal/dev/index.js'),
        'micromark-extension-gfm-autolink-literal/html': path.resolve(__dirname, 'node_modules/micromark-extension-gfm-autolink-literal/dev/html.js'),
        'micromark-extension-gfm-task-list-item': path.resolve(__dirname, 'node_modules/micromark-extension-gfm-task-list-item/dev/index.js'),
        'micromark-extension-gfm-task-list-item/html': path.resolve(__dirname, 'node_modules/micromark-extension-gfm-task-list-item/dev/html.js'),
        'micromark-extension-gfm-table': path.resolve(__dirname, 'node_modules/micromark-extension-gfm-table/dev/index.js'),
        'micromark-extension-gfm-table/html': path.resolve(__dirname, 'node_modules/micromark-extension-gfm-table/dev/html.js'),
        'micromark-util-normalize-identifier': path.resolve(__dirname, 'node_modules/micromark-util-normalize-identifier/dev/index.js'),

      }
    },

    // 🚀 PERFORMANCE OPTIMIZATION (IMPORTANT)
    build: {
      target: 'es2018', // Smaller modern output
      minify: 'esbuild',
      cssCodeSplit: true,
      sourcemap: false,
      reportCompressedSize: true,
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 500,

      rollupOptions: {
        output: {
          // Default chunking is safer to avoid circular dependencies
        }
      }
    }
  }
})
