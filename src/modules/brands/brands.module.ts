import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService, PrismaClient],
})
export class BrandsModule {}
