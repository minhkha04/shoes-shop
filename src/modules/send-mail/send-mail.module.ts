import { Module } from '@nestjs/common';
import { SendMailService } from './send-mail.service';
import { SendMailController } from './send-mail.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Module({
  imports: [ConfigModule],
  controllers: [SendMailController],
  providers: [
    SendMailService,
    {
      provide: Resend,
      useFactory: (cfg: ConfigService) => new Resend(cfg.get<string>('RESEND_API_KEY')),
      inject: [ConfigService],
    },
  ],
  exports: [SendMailService, Resend],
})
export class SendMailModule {}
