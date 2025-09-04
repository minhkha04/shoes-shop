import { Controller } from '@nestjs/common';
import { SendMailService } from './send-mail.service';

@Controller('send-mail')
export class SendMailController {
  constructor(private readonly sendMailService: SendMailService) {}
}
