import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../guards/roles.guard';
import { Role } from '../../enums/roles.enum';

@Controller('admin')
@Roles(Role.ADMIN)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post('create-count')
  create(@Body() createAdminDto: CreateAccountDto) {
    return this.adminService.createAccount(createAdminDto);
  }


}
