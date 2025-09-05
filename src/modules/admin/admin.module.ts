import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaClient],
})
export class AdminModule {}
