import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { SendMailModule } from './modules/send-mail/send-mail.module';
import { EmailOtpModule } from './modules/email-otp/email-otp.module';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { PrismaClient } from '@prisma/client';
import { ApplicationInit } from './config/application-init';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    SendMailModule,
    EmailOtpModule,
    UsersModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService , JwtStrategy, PrismaClient, ApplicationInit],
})
export class AppModule { }
