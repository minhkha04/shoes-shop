import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ApplicationInit implements OnApplicationBootstrap {
    constructor(
        private readonly prisma: PrismaClient,
        private readonly cfg: ConfigService,
    ) { }

    async onApplicationBootstrap() {
        const email = this.cfg.get<string>('ADMIN_EMAIL') ?? 'admin@example.com';
        const rawPassword = this.cfg.get<string>('ADMIN_PASSWORD') ?? 'Admin@123';
        const acct = 'EMAIL' as const; // khớp enum account_type

        const password = await bcrypt.hash(rawPassword, 10);

        // Unique (email, account_type) như Đại vương đã thiết kế
        // Nếu đã có → update {} (không đổi gì); nếu chưa có → create
        await this.prisma.users.upsert({
            where: { email_account_type: { email, account_type: acct } },
            update: {},
            create: {
                email,
                password,
                role: 'ADMIN',         
                account_type: acct,
                fullName: 'Administrator',
            },
            select: { id: true, email: true, role: true },
        })
            .then((u) => console.log(`Admin ensured: ${u.email}`))
            .catch((e) => console.log('Admin seed failed', e));
    }
}
