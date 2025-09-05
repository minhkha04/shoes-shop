import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AdminService {

  constructor(
    private readonly prisma: PrismaClient
  ) { }

  async createAccount(request: CreateAccountDto) {
    let { email, password, fullName, role } = request;
    let isExist = await this.prisma.users.findUnique({
      where: { email_account_type: { email: email, account_type: 'EMAIL' } }
    });

    if (isExist) {
      throw new BadRequestException('Email already exists');
    }

    let newUser = await this.prisma.users.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        fullName,
        role,
        account_type: 'EMAIL',
      }
    });
    return {...newUser, password: undefined };
  }
}
