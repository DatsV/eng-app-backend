import { IsString } from 'class-validator';

export class CreateCodeDto {
  @IsString()
  code: string;
}
