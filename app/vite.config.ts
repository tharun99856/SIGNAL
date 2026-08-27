import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    inspectAttr(), 
    react({
      // Enable fast refresh for instant updates
      fastRefresh: true,
      // Reduce babel overhead
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    })
  ],
  server: {
    port: 3000,
    host: true,
    // FASTER HMR
    hmr: {
      overlay: false,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // PERFORMANCE BOOST - Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    // Don't pre-bundle heavy 3D libs - lazy load them
    exclude: ['@react-three/fiber', '@react-three/drei', 'three'],
  },
  // BUILD OPTIMIZATIONS
  build: {
    // Target modern browsers for smaller bundles
    target: 'esnext',
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // SMART CODE SPLITTING - separate heavy libs
        manualChunks: {
          'react-core': ['react', 'react-dom', 'react-router-dom'],
          'ui-radix': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          '3d-libs': ['three', '@react-three/fiber', '@react-three/drei'],
          'animation': ['gsap', '@studio-freight/lenis'],
          'charts': ['recharts'],
        },
      },
    },
    // MINIFY for smaller bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
    },
    // Source maps only in dev
    sourcemap: false,
  },
});
