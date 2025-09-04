import { Controller } from '@nestjs/common';
import { EmailOtpService } from './email-otp.service';

@Controller('email-otp')
export class EmailOtpController {
  constructor(private readonly emailOtpService: EmailOtpService) {}
}
