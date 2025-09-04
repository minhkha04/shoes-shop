import { Module } from '@nestjs/common';
import { EmailOtpService } from './email-otp.service';
import { EmailOtpController } from './email-otp.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [EmailOtpController],
  providers: [EmailOtpService, PrismaClient],
})
export class EmailOtpModule {}
