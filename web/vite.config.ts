import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve:{
    alias: {
      '@': resolve(__dirname, './src'),
    },
    extensions:['.js','.jsx','.ts','.tsx']
  },
  plugins: [react()],

  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'antd',
      'zustand',
      'lodash-es'
    ],
    // Force optimize even in development
    force: false
  },

  // Build optimizations
  build: {
    // Enable build cache
    cssCodeSplit: true,
    sourcemap: false, // Disable sourcemaps in production for faster builds

    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI library chunk
          'antd-vendor': ['antd', 'antd-style', '@lobehub/ui'],
          // Utilities chunk
          'utils-vendor': ['lodash-es', 'zustand', 'query-string', 'url-join']
        },
        // Optimize chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },

    // Increase chunk size warning limit (500kb)
    chunkSizeWarningLimit: 500,

    // Enable minification
    minify: 'esbuild',

    // Target modern browsers for smaller bundles
    target: 'es2020',

    // Optimize CSS
    cssMinify: true,

    // Increase rollup worker threads
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },

  // Development server optimizations
  server:{
    // Enable filesystem caching
    fs: {
      // Allow serving files from project root
      strict: true
    },

    // Pre-warm frequently used files
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/App.tsx',
        './src/routes/index.tsx'
      ]
    },

    proxy:{
      '/api':{
        target:'http://localhost:5228/',
        changeOrigin:true,
      },
      "/v3":{
        target:'http://localhost:5228/',
        changeOrigin:true,
      }
    }
  },

  // Enable esbuild optimizations
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    // Faster builds with pure annotations
    pure: ['console.log'],
    drop: [] // Remove in production: ['console', 'debugger']
  }
})
