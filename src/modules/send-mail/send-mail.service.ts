import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class SendMailService {

    private readonly from: string;

    constructor(
        private readonly resend: Resend,
        cfg: ConfigService,
    ) {
        this.from = cfg.get<string>('MAIL_FROM')!;
    }

    async sendMail({ to, subject, html }) {
        const { data, error } = await this.resend.emails.send({
            from: this.from,
            to,
            subject,
            html,
        });
        console.log(data);
        if (error) {
            console.log(error);
            throw new HttpException('Internal Server', 500);
        }
    }
}
