import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('brands')
export class BrandsController {
  constructor(
    private readonly brandsService: BrandsService,
  ) { }

  @Get('public/:id')
  findOnePublic(@Param('id') id: string) {
    return this.brandsService.findOnePublic(id);
  }

  @Get('/public')
  findAllPublic() {
    return this.brandsService.findAllPublic();
  }

  @ApiBearerAuth()
  @Roles(Role.MANAGER, Role.STAFF)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @ApiBearerAuth()
  @Roles(Role.MANAGER, Role.STAFF)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(Role.MANAGER, Role.STAFF)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(Role.MANAGER, Role.STAFF)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }
}
