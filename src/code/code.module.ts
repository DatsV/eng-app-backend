import { AuthModule } from './../auth/auth.module';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeEntity } from './entities/code.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CodeEntity]),
    UserModule,
    MailModule,
    AuthModule,
  ],
  controllers: [CodeController],
  providers: [CodeService],
})
export class CodeModule {}
