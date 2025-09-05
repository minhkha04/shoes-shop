import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, CloudinaryProvider, PrismaClient],
})
export class UploadsModule {}
