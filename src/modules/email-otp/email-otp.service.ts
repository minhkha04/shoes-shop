import { email_otp } from './../../../node_modules/.prisma/client/index.d';
import { HttpException, Injectable } from '@nestjs/common';
import { generateOtp } from '../../helper/util';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmailOtpService {

    constructor(private readonly prisma: PrismaClient) { }

    async generateOtp(email: string) {
        await this.prisma.email_otp.deleteMany({ where: { email } });
        const otp = generateOtp();
        await this.prisma.email_otp.create({
            data: {
                otp: bcrypt.hashSync(otp, 10),
                email,
                expired_time: new Date(new Date().getTime() + 5 * 60000) // 5 minutes
            }
        })
        return otp;
    }

    async verifyOtp(email: string, otp: string) {
        const email_otp = await this.prisma.email_otp.findFirst({
            where: { email },
        });
        if (!email_otp || !email_otp.expired_time || !email_otp.otp) {
            throw new HttpException('OTP not found', 404);
        }
        if (email_otp.expired_time < new Date()) {
            throw new HttpException('OTP expired', 400);
        }
        const isMatch = await bcrypt.compare(otp, email_otp.otp);
        if (!isMatch) {
            throw new HttpException('Invalid OTP', 400);
        }
        await this.prisma.email_otp.deleteMany({ where: { email } });
    }
}
