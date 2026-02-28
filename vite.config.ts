import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Simple plugin to serve artifact images
const serveArtifacts = () => ({
  name: 'serve-artifacts',
  configureServer(server) {
    const artifactDir = 'C:\\Users\\akshi\\.gemini\\antigravity\\brain\\1544317d-d04f-4826-867b-6c1e3c3d9e5d';
    server.middlewares.use('/local-images/', (req, res, next) => {
      const imgName = req.url.slice(1); // remove leading slash
      let srcFile = '';
      if (imgName === 'hero-city.jpg') srcFile = 'media__1772289021332.jpg';
      if (imgName === 'hero-phone.jpg') srcFile = 'media__1772289038417.jpg';
      if (imgName === 'hero-hand.jpg') srcFile = 'media__1772289048575.jpg';

      if (srcFile) {
        const fullPath = path.join(artifactDir, srcFile);
        if (fs.existsSync(fullPath)) {
          res.setHeader('Content-Type', 'image/jpeg');
          return fs.createReadStream(fullPath).pipe(res);
        }
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    serveArtifacts(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React into its own chunk
          'vendor-react': ['react', 'react-dom'],
          // Split chart library
          'vendor-recharts': ['recharts'],
          // Split animation library
          'vendor-motion': ['motion'],
          // Split Supabase
          'vendor-supabase': ['@supabase/supabase-js'],
          // Split Radix UI into one chunk
          'vendor-radix': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-popover',
          ],
        },
      },
    },
  },
})