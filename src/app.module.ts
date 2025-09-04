import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategy } from './modules/auth/strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService , JwtStrategy],
})
export class AppModule { }
