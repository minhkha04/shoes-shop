import { Controller, Delete, Get, HttpCode, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';
import { UploadType } from 'src/enums/upload-type.enum';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/enums/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) { }

  @HttpCode(200)
  @Post('/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: Number(process.env.MAX_IMAGE_BYTES || 5 * 1024 * 1024) },
    }),
  )
  @ApiBody({ type: FileUploadDto })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'uploadType', enum: UploadType, required: true })
  @ApiQuery({ name: 'id', required: false, type: String })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.MANAGER, Role.STAFF)
  uploadImage(@UploadedFile() file: Express.Multer.File, @Query('uploadType') uploadType: UploadType, @Query('id') id: string) {
    return this.uploadsService.uploadImage(file, uploadType, id);
  }

  @HttpCode(200)
  @Post('/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: Number(process.env.MAX_IMAGE_BYTES || 5 * 1024 * 1024) },
    }),
  )
  @ApiBody({ type: FileUploadDto })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'id', required: false, type: String })
  uploadAvatar(@UploadedFile() file: Express.Multer.File, @Query('id') id: string) {
    return this.uploadsService.uploadImage(file, UploadType.AVATAR, id);
  }

  @Delete('/image/:publicId')
  @HttpCode(200)
  async deleteImage(@Param('publicId') publicId: string) {
    return this.uploadsService.deleteImagePublic(publicId)
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.MANAGER, Role.STAFF)
  @Delete('/image/product/:id')
  @HttpCode(200)
  async deleteImageProduct(@Param('id') id: string) {
    return this.uploadsService.deleteProductImage(id)
  }
}
