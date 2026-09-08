import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    {
      name: 'serve-and-copy-frames',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/frames/')) {
            const fileName = req.url.replace('/frames/', '').split('?')[0];
            const filePath = path.resolve(__dirname, 'frames', fileName);
            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'image/jpeg');
              res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
              return fs.createReadStream(filePath).pipe(res);
            }
          }
          next();
        });
      },
      closeBundle() {
        const dest = path.resolve(__dirname, 'dist', 'frames');
        if (fs.existsSync(dest)) {
          fs.rmSync(dest, { recursive: true, force: true });
        }
        fs.mkdirSync(dest, { recursive: true });
        const src = path.resolve(__dirname, 'frames');
        if (fs.existsSync(src)) {
          const files = fs.readdirSync(src);
          console.log(`Copying ${files.length} frames to dist/frames...`);
          for (const file of files) {
            fs.copyFileSync(path.join(src, file), path.join(dest, file));
          }
          console.log('Frames copied to dist/frames successfully.');
        }
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        notfound: path.resolve(__dirname, '404.html')
      }
    }
  }
});
