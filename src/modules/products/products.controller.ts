import { Controller, Get, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { CtreateProductVariantsDto } from './dto/create-product-variants.dto';
import { CreateProductColorDto } from './dto/create-product-color.dto';
import { UpdateProductColorDto } from './dto/update-product-color.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get('public')
  findAllPublic() {
    return this.productsService.findAllPublic();
  }

  @Get('public/:id')
  findOnePublic(@Param('id') id: string) {
    return this.productsService.findOnePublic(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.MANAGER, Role.STAFF)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.MANAGER, Role.STAFF)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.MANAGER, Role.STAFF)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.MANAGER, Role.STAFF)
  @Put(':id')
  updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.MANAGER, Role.STAFF)
  @Put('stock/:id/:stock')
  updateStock(@Param('id') id: string, @Param('stock') stock: number) {
    return this.productsService.updateStock(id, +stock);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.MANAGER, Role.STAFF)
  @Post('create-product-variant')
  createProductVariant(@Body() req: CtreateProductVariantsDto) {
    return this.productsService.addNewProductVariant(req);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.MANAGER, Role.STAFF)
  @Put('update-product-variant/:id')
  updateProductVariant(@Body() req: CtreateProductVariantsDto, @Param('id') id: string) {
    return this.productsService.updateProductVariant(id, req);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.MANAGER, Role.STAFF)
  @Post('create-product-color')
  createProductColor(@Body() req: CreateProductColorDto) {
    return this.productsService.addNewProductColor(req);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.MANAGER, Role.STAFF)
  @Post('update-product-color/:id')
  updateProductColor(@Body() req: UpdateProductColorDto, @Param('id') id: string) {
    return this.productsService.updateProductColor(id, req);
  }
}
