import { Body, Controller, Get, HttpCode, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserUpdateDto } from './dto/user-update.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @HttpCode(200)
  async getMyInfo(@Req() req: any) {
    const userId: string = req.user.sub;
    return this.usersService.getUserById(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put()
  @HttpCode(200)
  async updateUser(@Body() request: UserUpdateDto, @Req() req: any) {
    const userId: string = req.user.sub;
    return this.usersService.updateUser(userId, request);
  }

  
}
