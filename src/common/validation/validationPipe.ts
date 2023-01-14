import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (metadata.type === 'body') {
      const obj = plainToClass(metadata.metatype, value);
      const errors = await validate(obj);

      if (errors.length) {
        const messages = errors.reduce((acc, err) => {
          acc[err.property] = Object.values(err.constraints);
          return acc;
        }, {});
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Validation error',
            errors: messages,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return value;
  }
}
