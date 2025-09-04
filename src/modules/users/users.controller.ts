import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMyInfo(@Req() req: any) {
    // payload do JwtStrategy trả về: { sub, email, role, iat, exp }
    const userId: string = req.user.sub;
    return this.usersService.getUserById(userId);
  }
}
