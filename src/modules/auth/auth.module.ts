import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { SendMailModule } from '../send-mail/send-mail.module';
import { EmailOtpService } from '../email-otp/email-otp.service';

@Module({
  imports: [SendMailModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, PrismaClient, EmailOtpService],
})
export class AuthModule {}
