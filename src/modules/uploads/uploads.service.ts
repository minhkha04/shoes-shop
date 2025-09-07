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


    private async uploadCloduddinary(file: Express.Multer.File, publicId: string, uploadType: UploadType) {
        return await new Promise<any>((resolve, reject) => {
            const stream = this.cloudinary.uploader.upload_stream(
                {
                    public_id: publicId,
                    overwrite: true,
                    resource_type: 'image',
                    invalidate: true,
                    folder: `shoes-shop/${uploadType}`, // tùy chọn, xóa nếu không muốn folder
                },
                (err, result) => (err ? reject(err) : resolve(result)),
            );
            stream.end(file.buffer);
        });
    }

    private async deleteImage(publicId: string) {
        return await this.cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    }

    async uploadImage(file: Express.Multer.File, uploadType: UploadType, id: string = '') {
        if (!file) throw new BadRequestException('Missing file');
        if (!file.mimetype?.startsWith('image/')) {
            throw new BadRequestException('Image only');
        }

        let publicId: string = randomUUID();
        if (!id) {
            let upload = await this.uploadCloduddinary(file, publicId, uploadType);
            await this.prisma.cloudinary.create({
                data: {
                    public_id: upload.public_id,
                    url: upload.secure_url,
                }
            });
            return { message: 'Upload image success', url: upload.secure_url, public_id: upload.public_id };
        }

        if (uploadType === UploadType.PRODUCT) {
            let product_colors = await this.prisma.product_colors.findFirst({
                where: { id },
            });

            if (!product_colors) throw new BadRequestException('Product color not found');

            let upload = await this.uploadCloduddinary(file, publicId, uploadType);

            await this.prisma.cloudinary.create({
                data: {
                    public_id: upload.public_id,
                    url: upload.secure_url,
                }
            });

            let image = await this.prisma.product_colors_image.create({
                data: {
                    product_colors_id: id,
                    image: upload.secure_url,
                }
            });
            return { message: 'Upload image success', image };
        }



        let cloudinaryStogare: any;
        if (uploadType === UploadType.AVATAR) {
            let user = await this.prisma.users.findFirst({
                where: { id },
            });
            if (!user) throw new BadRequestException('User not found');
            cloudinaryStogare = user.avatarUrl
                ? await this.prisma.cloudinary.findFirst({
                    where: { url: user.avatarUrl },
                })
                : null;
        } else if (uploadType === UploadType.BRAND) {
            let brand = await this.prisma.brands.findFirst({
                where: { id },
            });
            if (!brand) throw new BadRequestException('Brand not found');
            cloudinaryStogare = brand.image
                ? await this.prisma.cloudinary.findFirst({
                    where: { url: brand.image },
                })
                : null;
        } else if (uploadType === UploadType.PRODUCT_MAIN) {
            let product = await this.prisma.products.findFirst({
                where: { id }
            });
            if (!product) throw new BadRequestException('Product not found');
            cloudinaryStogare = product.image_main
                ? await this.prisma.cloudinary.findFirst({
                    where: { url: product.image_main },
                })
                : null;
        } else if (uploadType === UploadType.PRODUCT_HOVER) {
            let product = await this.prisma.products.findFirst({
                where: { id }
            });
            if (!product) throw new BadRequestException('Product not found');
            cloudinaryStogare = product.image_hover
                ? await this.prisma.cloudinary.findFirst({
                    where: { url: product.image_hover },
                })
                : null;
        }

        let urlNew = '';
        if (cloudinaryStogare) {
            let upload = await this.uploadCloduddinary(file, cloudinaryStogare.public_id, uploadType);
            await this.deleteImage(cloudinaryStogare.public_id);
            await this.prisma.cloudinary.update({
                where: { id: cloudinaryStogare.id },
                data: { url: upload.secure_url },
            });
            urlNew = upload.secure_url;
        } else {
            let upload = await this.uploadCloduddinary(file, publicId, uploadType);
            await this.prisma.cloudinary.create({
                data: {
                    public_id: upload.public_id,
                    url: upload.secure_url,
                }
            });
            urlNew = upload.secure_url;
        }
        if (uploadType === UploadType.AVATAR) {
            let user = await this.prisma.users.update({
                where: { id },
                data: { avatarUrl: urlNew },
            });
            return { user };
        } else if (uploadType === UploadType.BRAND) {
            let brand = await this.prisma.brands.update({
                where: { id },
                data: { image: urlNew },
            });
            return { brand };
        } else if (uploadType === UploadType.PRODUCT_MAIN) {
            let product = await this.prisma.products.update({
                where: { id },
                data: { image_main: urlNew },
            });
            return { product };
        } else if (uploadType === UploadType.PRODUCT_HOVER) {
            let product = await this.prisma.products.update({
                where: { id },
                data: { image_hover: urlNew },
            });
            return { product };
        }
    }

    async deleteImagePublic(publicId: string) {
        await this.prisma.cloudinary.deleteMany({
            where: { public_id: publicId }
        });
        return await this.deleteImage(publicId);
    }

    async deleteProductImage(id: string) {
        let productImage = await this.prisma.product_colors_image.findFirst({
            where: { id }
        });
        if (!productImage) throw new BadRequestException('Product image not found');

        let cloudinary = productImage.image && await this.prisma.cloudinary.findFirst({
            where: { url: productImage.image }
        });

        if (cloudinary) {
            await this.deleteImage(cloudinary.public_id);
            await this.prisma.cloudinary.deleteMany({
                where: { id: cloudinary.id }
            });
        }
        
        await this.prisma.product_colors_image.delete({
            where: { id }
        });
        return { message: 'Delete product image success' };

    }
}
