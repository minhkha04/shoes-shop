import { Provider } from './enums/provider.enum';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SiginInDto } from './dto/sigin-in.dto';
import { SignUpDto } from './dto/sigin-up.dto';
import * as bcrypt from 'bcrypt';
import { generateToken } from './helper/util';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/jwt.strategy';

@Injectable()
export class AuthService {

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaClient,
  ) { }

  private async signInWithEmailAndPassword(request: SiginInDto) {

    let { email, password } = request;

    if (!email || !password) {
      throw new HttpException('Email and password are required', HttpStatus.BAD_REQUEST);
    }

    let user = await this.prisma.users.findUnique({
      where: { email_account_type: { email, account_type: 'EMAIL' } },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    let isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    return { token: await generateToken(user) };
  }

  // TODO: Implement OAuth2 flow for Google and Facebook
  private async signInWithGoogle(request: SiginInDto) {
    if (!request.accessToken) {
      throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
    }
    return "Sign in with Google";
  }

  private async signInWithFacebook(request: SiginInDto) {
    if (!request.accessToken) {
      throw new HttpException('Access token is required', HttpStatus.BAD_REQUEST);
    }
    return "Sign in with Facebook";
  }

  async signIn(requset: SiginInDto, provider: Provider) {
    switch (provider) {
      case Provider.EMAIL:
        return this.signInWithEmailAndPassword(requset);
      case Provider.GOOGLE:
        return this.signInWithGoogle(requset);
      case Provider.FACEBOOK:
        return this.signInWithFacebook(requset);
      default:
        throw new Error('Invalid provider');
    }
  }

  async signUp(request: SignUpDto) {
    let { email, password, fullName, code } = request;
    let userExist = await this.prisma.users.findUnique({
      where: { email_account_type: { email: email, account_type: 'EMAIL' } },
    });

    if (userExist) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    // For simplicity, we use a fixed code. In real-world, this should be dynamic.
    if (code !== 123456) {
      throw new HttpException('Invalid code', HttpStatus.BAD_REQUEST);
    }
    let user = await this.prisma.users.create({
      data: {
        email: email,
        password: await bcrypt.hash(password, 10),
        fullName: fullName,
        account_type: 'EMAIL',
        role: 'USER',
      },
    });

    return { token: await generateToken(user) };
  }

  async refreshToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get<string>('SECRET_KEY'),
    });

    let user = await this.prisma.users.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { token: await generateToken(user) };
  }
}
