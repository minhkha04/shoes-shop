import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserUpdateDto } from './dto/user-update.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async getUserById(userId: string) {
        let userInfo =  await this.prisma.users.findUnique({
            where: { id: userId },
        });
        return {...userInfo, password: undefined };
    }

    async updateUser(userId: string, request: UserUpdateDto) {
        let { fullName, phoneNumber, address, sex, dateOfBirth } = request;
        let userUpdate = await this.prisma.users.findUnique({
            where: { id: userId },
        });
        if (!userUpdate) {
            throw new NotFoundException('User not found');
        }
        let respone = await this.prisma.users.update({
            where: { id: userId },
            data: { fullName, phone_number: phoneNumber, address, sex, date_of_birth: dateOfBirth },
        });
        return { ...respone, password: undefined };
    }
}
