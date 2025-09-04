import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategy } from './modules/auth/strategy/jwt.strategy';
import { SendMailModule } from './modules/send-mail/send-mail.module';
import { EmailOtpModule } from './modules/email-otp/email-otp.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    SendMailModule,
    EmailOtpModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService , JwtStrategy],
})
export class AppModule { }
