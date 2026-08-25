import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ConflictException,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.code === 11000) {
      return response.status(409).json({
        statusCode: 409,
        message: 'Dữ liệu bị trùng lặp',
        error: 'Conflict',
      });
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Lỗi server nội bộ!',
    });
  }
}
