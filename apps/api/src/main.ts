import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường không có trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu khách gửi thêm trường lạ
      transform: true, // Tự động chuyển đổi kiểu dữ liệu nếu có thể
    }),
  );
  await app.listen(process.env.PORT ?? 3001);
  console.log(`API đang đợi lệnh tại: http://localhost:3001`);
}
bootstrap();
