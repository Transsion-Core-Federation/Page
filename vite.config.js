import { defineConfig } from 'vite';

// URL rewrite plugin for clean URLs
function urlRewritePlugin() {
  return {
    name: 'url-rewrite',
    configResolved(config) {
      this.config = config;
    },
    middlewares() {
      return (req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathname = url.pathname;

        const cleanRoutes = {
          '/about': '/src/about.html',
          '/rules': '/src/rules.html',
          '/appeal': '/src/appeal.html',
          '/join-us': '/src/join-us.html',
        };

        if (cleanRoutes[pathname]) {
          req.url = cleanRoutes[pathname];
        }

        next();
      };
    },
  };
}

export default defineConfig({
  base: '/',
  root: './',
  plugins: [urlRewritePlugin()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        about: './src/about.html',
        rules: './src/rules.html',
        appeal: './src/appeal.html',
        'join-us': './src/join-us.html',
      },
    },
  },
  server: {
    port: 5173,
  },
  appType: 'mpa',
});
