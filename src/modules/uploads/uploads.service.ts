import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { CLOUDINARY } from './cloudinary.provider';
import type { v2 as CloudinarySDK } from 'cloudinary';
import { randomUUID } from 'crypto';
import { UploadType } from 'src/enums/upload-type.enum';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UploadsService {
    constructor(
        @Inject(CLOUDINARY) private cloudinary: typeof CloudinarySDK,
        private readonly prisma: PrismaClient,
    ) { }

    async uploadImage(file: Express.Multer.File, uploadType: UploadType, id: string, userId: string) {
        if (!file) throw new BadRequestException('Missing file');
        if (!file.mimetype?.startsWith('image/')) {
            throw new BadRequestException('Image only');
        }

        let publicId: string = randomUUID();

        if (uploadType === UploadType.AVATAR) {
            publicId = id;
        }

        const res = await new Promise<any>((resolve, reject) => {
            const stream = this.cloudinary.uploader.upload_stream(
                {
                    public_id: publicId,
                    overwrite: true,
                    resource_type: 'image',
                    folder: 'app/uploads', // tùy chọn, xóa nếu không muốn folder
                },
                (err, result) => (err ? reject(err) : resolve(result)),
            );
            stream.end(file.buffer);
        });


        switch (uploadType) {
            case UploadType.AVATAR:
                let user = await this.prisma.users.findUnique({ where: { id } });

                if (!user) {
                    this.deleteImage(res.public_id);
                    throw new BadRequestException('User not found');
                }

                await this.prisma.users.update({ where: { id }, data: { avatarUrl: res.secure_url } });

                let image = await this.prisma.images.findFirst({ where: { public_id: res.public_id, upload_type: uploadType } });

                if (!image) {
                    await this.prisma.images.create({
                        data: { public_id: res.public_id, url: res.secure_url, upload_type: uploadType, uploaded_by: userId },
                    });
                } else {
                    await this.prisma.images.update({
                        where: { id: image.id },
                        data: { url: res.secure_url, uploaded_by: userId },
                    });
                }


                break;
            case UploadType.PRODUCT:
                break;
            case UploadType.BRAND:
                break;
            case UploadType.OTHER:
                break;
            default:
                throw new BadRequestException('Invalid uploadType');
        }
        return { message: 'Upload image successfully' };
    }

    async deleteImage(publicId: string) {
        return await this.cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    }
}
