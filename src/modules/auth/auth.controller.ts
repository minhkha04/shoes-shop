import { Controller, Post, Body, Query, ParseEnumPipe, HttpCode, Get, UseGuards, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SiginInDto } from './dto/sigin-in.dto';
import { SignUpDto } from './dto/sigin-up.dto';
import { Provider } from './enums/provider.enum';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Role } from './enums/roles.enum';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './config/roles.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('refresh-token/:token')
  refreshToken(@Param('token') token: string) {
    return this.authService.refreshToken(token);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('test')
  @Roles(Role.USER)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  test() {
    return "test";
  }

}
