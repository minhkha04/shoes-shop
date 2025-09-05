import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { Provider } from '@nestjs/common';

export const CLOUDINARY = 'CLOUDINARY';

export const CloudinaryProvider: Provider = {
    provide: CLOUDINARY,
    useFactory: () => {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        } as ConfigOptions);
        return cloudinary;
    },
};
