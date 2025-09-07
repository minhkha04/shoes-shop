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
import { UploadsModule } from './modules/uploads/uploads.module';
import { BrandsModule } from './modules/brands/brands.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    SendMailModule,
    EmailOtpModule,
    UsersModule,
    AdminModule,
    UploadsModule,
    BrandsModule,
    CategoriesModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService , JwtStrategy, PrismaClient, ApplicationInit],
})
export class AppModule { }
