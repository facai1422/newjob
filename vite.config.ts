import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 核心框架
          vendor: ['react', 'react-dom'],
          // 路由
          router: ['react-router-dom'],
          // UI 库
          ui: ['lucide-react', 'swiper', 'framer-motion'],
          // 工具库
          utils: ['clsx', 'tailwind-merge'],
          // Supabase
          supabase: ['@supabase/supabase-js'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      },
    },
    // 生产环境不生成 sourcemap，减少包大小
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info'] : [],
      },
    },
    // CSS 代码分割，提升首屏加载
    cssCodeSplit: true,
    // 提升构建性能
    chunkSizeWarningLimit: 1000,
    // 预加载策略
    assetsInlineLimit: 4096,
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'lucide-react', 
      'swiper',
      'framer-motion',
      '@supabase/supabase-js',
      'clsx',
      'tailwind-merge'
    ],
    // 强制预构建某些依赖
    force: true,
  },
  // 开发服务器优化
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: false, // 关闭错误遮罩，使用控制台
    },
    // 预热常用文件
    warmup: {
      clientFiles: [
        './src/App.tsx',
        './src/main.tsx',
        './src/components/ui/**/*.tsx',
      ],
    },
  },
  // 性能提示配置
  esbuild: {
    // 移除生产环境的 debugger
    drop: process.env.NODE_ENV === 'production' ? ['debugger'] : [],
    // 保持类名，方便调试
    keepNames: process.env.NODE_ENV !== 'production',
  },
});