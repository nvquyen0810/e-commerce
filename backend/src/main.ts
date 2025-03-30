import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Cấu hình CORS
  app.enableCors();

  // Middleware để log requests
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Phục vụ các file static khác từ thư mục public
  app.use(express.static(join(__dirname, '..', 'public')));

  // Phục vụ file static từ thư mục build của admin
  app.use('/admin', express.static(join(__dirname, '..', 'public', 'admin', 'build')));

  // Middleware để xử lý các route của React Admin
  const adminRoutes = ['/dashboard', '/authentication', '/tables', '/billing', '/notifications', '/profile'];
  
  app.use((req, res, next) => {
    const path = req.path;
    
    // Nếu path bắt đầu bằng /admin hoặc là một trong các admin routes
    if (path.startsWith('/admin') || adminRoutes.some(route => path.startsWith(route))) {
      const indexPath = join(__dirname, '..', 'public', 'admin', 'build', 'index.html');
      console.log('Serving admin index.html for path:', path);
      console.log('File path:', indexPath);
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('Error loading admin interface');
        }
      });
    } else {
      next();
    }
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  });

  await app.listen(3000);
  console.log('Server is running on http://localhost:3000');
  console.log('Admin interface available at http://localhost:3000/admin');
}
bootstrap();
