import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Cấu hình CORS
  app.enableCors();
  
  // Phục vụ file static từ thư mục public
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/',
  });

  // Phục vụ file index.html cho route admin
  app.get('/admin', (req, res) => {
    res.sendFile(join(__dirname, '..', 'public', 'admin', 'index.html'));
  });

  // Xử lý các route khác của admin
  app.get('/admin/*', (req, res) => {
    res.sendFile(join(__dirname, '..', 'public', 'admin', 'index.html'));
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
