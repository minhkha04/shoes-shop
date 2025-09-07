import { Controller, Post, Body, Query, ParseEnumPipe, HttpCode, Get, UseGuards, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SiginInDto } from './dto/sigin-in.dto';
import { SignUpDto } from './dto/sigin-up.dto';
import { Provider } from '../../enums/provider.enum';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SendMailService } from '../send-mail/send-mail.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { OtpType } from '../../enums/otp-type.enum';
import { ResetPasswordDto } from './dto/reset-password.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly sendMail: SendMailService) { }

  @HttpCode(200)
  @Post('sign-in')
  @ApiQuery({ name: 'provider', enum: Provider, required: true })
  create(@Body() signInDto: SiginInDto, @Query('provider') provider: Provider) {
    return this.authService.signIn(signInDto, provider);
  }

  @HttpCode(201)
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('refresh-token/:token')
  refreshToken(@Param('token') token: string) {
    return this.authService.refreshToken(token);
  }

  @HttpCode(200)
  @Post('send-otp')
  @ApiQuery({ name: 'otpType', enum: OtpType, required: true })
  sendOtp(@Body() request: SendOtpDto, @Query('otpType') otpType: OtpType) {
    return this.authService.sendOtp(request, otpType);
  }

  @HttpCode(200)
  @Put('reset-password')
  resetPassword(@Body() request: ResetPasswordDto) {
    return this.authService.resetPassword(request);
  }

  @HttpCode(200)
  @Get('introspect/:token')
  introspect(@Param('token') token: string) {
    return this.authService.introspect(token);
  }
}
