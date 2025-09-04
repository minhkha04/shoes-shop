import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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
}
